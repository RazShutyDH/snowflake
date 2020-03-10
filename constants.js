// @flow
import * as d3 from 'd3'
import EXECUTION from './trackData/execution.json'
import LEADERSHIP from './trackData/leadership.json'
import PERSONAL_EXCELLENCE from './trackData/personalExcellence.json'
import TECHNICAL_EXCELLENCE from './trackData/technicalExcellence.json'

export type TrackId = 'EXECUTION' | 'LEADERSHIP' | 'PERSONAL_EXCELLENCE' | 'TECHNICAL_EXCELLENCE'
export type Milestone = 0 | 1 | 2 | 3 | 4 | 5

export type MilestoneMap = {
  'EXECUTION': Milestone,
  'LEADERSHIP': Milestone,
  'PERSONAL_EXCELLENCE': Milestone,
  'TECHNICAL_EXCELLENCE': Milestone
}
export const milestones = [0, 1, 2, 3, 4, 5, 6]

export const titles = [
  {label: 'Software Engineer - IC1', minPoints: 0, maxPoints: 24},
  {label: 'Software Engineer - IC2', minPoints: 25, maxPoints: 53},
  {label: 'Software Engineer - IC3', minPoints: 54, maxPoints: 87},
  {label: 'Tech Leader', minPoints: 88},
  {label: 'Engineering Manager', minPoints: 88}
]

export const pointsToLevels = {
  '0': '1.1',
  '9': '1.2',
  '18': '1.3',
  '25': '2.1',
  '38': '2.2',
  '51': '2.3',
  '64': '3.1',
  '72': '3.2',
  '80': '3.3',
  '98': '4.1',
  '110': '4.2',
  '130': '5.1',
  '160': '5.2'
}

export const maxLevel = 192

export type Track = {
  displayName: string,
  category: string, // TK categoryId type?
  description: string,
  milestones: {
    summary: string,
    signals: string[],
    examples: string[]
  }[]
}

type Tracks = {|
  'EXECUTION': Track,
  'LEADERSHIP': Track,
  'PERSONAL_EXCELLENCE': Track,
  'TECHNICAL_EXCELLENCE': Track
  |}

export const tracks: Tracks = {
                                 EXECUTION, LEADERSHIP, PERSONAL_EXCELLENCE,TECHNICAL_EXCELLENCE
                              };

 
export const trackIds: TrackId[] = Object.keys(tracks)


export const categoryIds: Set<string> = trackIds.reduce((set, trackId) => {
  set.add(tracks[trackId].category)
  return set
}, new Set())

export const categoryPointsFromMilestoneMap = (milestoneMap: MilestoneMap) => {
  let pointsByCategory = new Map()
  trackIds.forEach((trackId) => {
    const milestone = milestoneMap[trackId]
    const categoryId = tracks[trackId].category
    let currentPoints = pointsByCategory.get(categoryId) || 0
    if (milestone === 0){
      pointsByCategory.set(categoryId, currentPoints + 0)
    }
    else {
      pointsByCategory.set(categoryId, currentPoints + tracks[trackId].milestones[milestone - 1].points)
    }
  })
  return Array.from(categoryIds.values()).map(categoryId => {
    const points = pointsByCategory.get(categoryId)
    return { categoryId, points: pointsByCategory.get(categoryId) || 0 }
  })
}

export const totalPointsFromMilestoneMap = (milestoneMap: MilestoneMap): number => {
  var sum = 0;
  trackIds.map(trackId => {
    const milestone = milestoneMap[trackId]
    if (milestone > 0) {
      sum = sum + tracks[trackId].milestones[milestone-1].points
    }
  })
  return sum;
}


export const categoryColorScale = d3.scaleOrdinal()
  .domain(categoryIds)
  .range(['#007DA4', '#C4D600', '#FB8B24', '#D90368'])


export const eligibleTitles = (milestoneMap: MilestoneMap): string[] => {
  const totalPoints = totalPointsFromMilestoneMap(milestoneMap)
  var titleList = titles.filter(title => (title.minPoints === undefined || totalPoints >= title.minPoints)
                             && (title.maxPoints === undefined || totalPoints <= title.maxPoints))
    .map(title => title.label)

    let categoryPoints = categoryPointsFromMilestoneMap(milestoneMap)

    if (categoryPoints[0].points <= 23)
    {
      titleList = titleList.filter(e => e !== "Tech Leader");
    }
    if (categoryPoints[1].points+categoryPoints[2].points+categoryPoints[3].points <= 65)
    {
      titleList = titleList.filter(e => e !== "Engineering Manager");
    }
    return titleList;
}

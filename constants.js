// @flow
import * as d3 from 'd3'
import EXECUTION from './trackData/execution.json'
import EXECUTION_MANAGEMENT from './trackData/executionManagerTrack.json'
import LEADERSHIP from './trackData/leadership.json'
import LEADERSHIP_MANAGEMENT from './trackData/leadershipManagerTrack.json'
import PERSONAL_EXCELLENCE from './trackData/personalExcellence.json'
import PERSONAL_MANAGEMENT from './trackData/personalManagerTrack.json'
import TECHNICAL_EXCELLENCE from './trackData/technicalExcellence.json'
import TECHNICAL_MANAGEMENT from './trackData/technicalManagerTrack.json'

export type TrackId = 'TECHNICAL_MANAGEMENT' | 'EXECUTION_MANAGEMENT' | 'LEADERSHIP_MANAGEMENT' | 'PERSONAL_MANAGEMENT'
            |'EXECUTION' | 'LEADERSHIP' | 'PERSONAL_EXCELLENCE' | 'TECHNICAL_EXCELLENCE'
export type Milestone = 0 | 1 | 2 | 3 | 4 | 5

export type MilestoneMap = {
  'EXECUTION': Milestone,
  'EXECUTION_MANAGEMENT': Milestone,
  'LEADERSHIP': Milestone,
  'PERSONAL_EXCELLENCE': Milestone,
  'TECHNICAL_EXCELLENCE': Milestone,
  'TECHNICAL_MANAGEMENT' : Milestone, 
  'EXECUTION_MANAGEMENT' : Milestone, 
  'LEADERSHIP_MANAGEMENT' : Milestone, 
  'PERSONAL_MANAGEMENT': Milestone,
}
export const milestones = [0, 1, 2, 3, 4, 5, 6]

export const titles = [
  {label: 'Software Engineer - IC1', minPoints: 0, maxPoints: 12},
  {label: 'Software Engineer - IC2', minPoints: 12, maxPoints: 25},
  {label: 'Software Engineer - IC3', minPoints: 25, maxPoints: 50},
  {label: 'Software Engineer - IC4', minPoints: 50, maxPoints: 80},
  {label: 'Software Engineer - IC5', minPoints: 80, maxPoints: 140},
  {label: 'Software Engineer - IC6', minPoints: 140},
  {label: 'Engineering Manager - M1',  minPoints: 50, maxPoints: 80},
  {label: 'Senior Engineering Manager - M2',  minPoints: 80, maxPoints: 140},
  {label: 'Director of Engineering - M3',  minPoints: 140, maxPoints: 160},
  {label: 'Senior Director of Engineering - M4',  minPoints: 160}
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
  'EXECUTION': Tracks,
  'EXECUTION_MANAGEMENT': Tracks,
  'LEADERSHIP': Tracks,
  'PERSONAL_EXCELLENCE': Tracks,
  'TECHNICAL_EXCELLENCE': Tracks,
  'TECHNICAL_MANAGEMENT' : Tracks, 
  'EXECUTION_MANAGEMENT' : Tracks, 
  'LEADERSHIP_MANAGEMENT' : Tracks, 
  'PERSONAL_MANAGEMENT': Tracks,
  |}

export const tracks: Tracks = {
                               TECHNICAL_MANAGEMENT, TECHNICAL_EXCELLENCE, EXECUTION_MANAGEMENT, EXECUTION,
                               LEADERSHIP_MANAGEMENT, LEADERSHIP, PERSONAL_MANAGEMENT, PERSONAL_EXCELLENCE
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

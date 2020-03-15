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

export const iCTitles = [
  {label: 'Software Engineer - IC1', minPoints: 0, maxPoints: 12},
  {label: 'Software Engineer - IC2', minPoints: 12, maxPoints: 25},
  {label: 'Software Engineer - IC3', minPoints: 22, maxPoints: 45},
  {label: 'Software Engineer - IC4', minPoints: 40, maxPoints: 80},
  {label: 'Software Engineer - IC5', minPoints: 70, maxPoints: 140},
  {label: 'Software Engineer - IC6', minPoints: 120}
]

export const mTitles = [
  {label: 'Engineering Manager - M1',  minPoints: 15, maxPoints: 36},
  {label: 'Senior Engineering Manager - M2',  minPoints: 24, maxPoints: 80},
  {label: 'Director of Engineering - M3',  minPoints: 55, maxPoints: 140},
  {label: 'Senior Director of Engineering - M4',  minPoints: 120, maxPoints: 220},
  {label: 'VP of Engineering - M5',  minPoints: 200}
]

export const titles = iCTitles.concat(mTitles);

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
  
  export const tracks: Tracks = {
    TECHNICAL_EXCELLENCE, TECHNICAL_MANAGEMENT, EXECUTION, EXECUTION_MANAGEMENT, 
    LEADERSHIP, LEADERSHIP_MANAGEMENT, PERSONAL_EXCELLENCE, PERSONAL_MANAGEMENT
  };
  
  export const mTracks: Tracks = {
    TECHNICAL_MANAGEMENT, EXECUTION_MANAGEMENT,LEADERSHIP_MANAGEMENT, PERSONAL_MANAGEMENT
  };

  export const iCTracks: Tracks = {
    TECHNICAL_EXCELLENCE, EXECUTION,LEADERSHIP, PERSONAL_EXCELLENCE
  };
  
  export const trackIds: TrackId[] = Object.keys(tracks)
  export const MtrackIds: MTrackId[] = Object.keys(mTracks)
  export const ICtrackIds: ICTrackId[] = Object.keys(iCTracks)
  
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
    var sum = {IC: 0, M: 0, Total: 0};
    trackIds.map(trackId => {
      const milestone = milestoneMap[trackId]
      if (milestone > 0) {
        sum.Total = sum.Total + tracks[trackId].milestones[milestone-1].points
        if (tracks[trackId].category === "IC") {
          sum.IC = sum.IC + tracks[trackId].milestones[milestone-1].points
        } else {
          sum.M = sum.M + tracks[trackId].milestones[milestone-1].points
        }
      }
    })
    return sum;
  }
  
  
  export const categoryColorScale = d3.scaleOrdinal()
  .domain(categoryIds)
  .range(['#FB8B24', '#D90368'])
  
  
  export const eligibleTitles = (milestoneMap: MilestoneMap): string[] => {
    const totalPoints = totalPointsFromMilestoneMap(milestoneMap)
    var titleICList = iCTitles.filter(title => (title.minPoints === undefined || totalPoints.IC >= title.minPoints)
    && (title.maxPoints === undefined || totalPoints.IC <= title.maxPoints))
    .map(title => title.label)
    
    var titleMList = mTitles.filter(title => (title.minPoints === undefined || totalPoints.M >= title.minPoints)
    && (title.maxPoints === undefined || totalPoints.M <= title.maxPoints))
    .map(title => title.label)

    //You can only be a Manager if you are an IC3 at least
    if (totalPoints.IC < iCTitles[2].minPoints)
    {
      return titleICList;
    }
    
    return titleICList.concat(titleMList);
  }
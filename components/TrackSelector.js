// @flow

import React from 'react'
import { MtrackIds, tracks, categoryColorScale } from '../constants'
import type { MilestoneMap, TrackId } from '../constants'

type Props = {
  milestoneByTrack: MilestoneMap,
  focusedTrackId: TrackId,
  setFocusedTrackIdFn: (TrackId) => void
}

class TrackSelector extends React.Component<Props> {
  render() {
    console.log(this.props.milestoneByTrack)
    return (
      <table>
        <style jsx>{`
          table {
            width: 90%;
            border-spacing: 3px;
            border-bottom: 2px solid #ccc;
            padding-bottom: 20px;
            margin-bottom: 20px;
            margin-left: -3px;
          }
          thead {
            width: 90%;
            border-spacing: 3px;
            border-bottom: 2px solid #ccc;
            padding-bottom: 20px;
            margin-bottom: 20px;
            margin-left: -3px;
          }
          .track-selector-value {
            line-height: 35px;
            width: 150px;
            text-align: center;
            background: white;
            font-weight: bold;
            font-size: 20px;
            border-radius: 12px;
            cursor: pointer;
          }
          .track-selector-label {
            text-align: center;
            font-size: 11px;
          }
        `}</style>
        <thead>
          <tr>
              <th>
                Technical Excellence
              </th>
              <th>
                Execution
              </th>
              <th>
                Leadership
              </th>
              <th>
                Personal Excellence
              </th>
          </tr>
        </thead>
        <br></br>
        <tbody>
          <tr>
            {MtrackIds.map(trackId => (
              <td key={trackId} className="track-selector-label" onClick={() => this.props.setFocusedTrackIdFn(trackId)}>
                {tracks[trackId].displayName}
              </td>
            ))}
          </tr>
          <tr>
            {MtrackIds.map(trackId => (
              <td key={trackId} className="track-selector-value"
                  style={{border: '4px solid ' + (trackId == this.props.focusedTrackId ? '#000': categoryColorScale(tracks[trackId].category)), background: categoryColorScale(tracks[trackId].category)}}
                  onClick={() => this.props.setFocusedTrackIdFn(trackId)}>
                {this.props.milestoneByTrack[trackId]}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    )
  }
}

export default TrackSelector

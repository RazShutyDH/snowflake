// @flow

import React from 'react'
import Help from "./Help";

type Props = {
  name: String,
  setNameFn: (string) => void
}

class Header extends React.PureComponent<Props> {
  render() {
    return (
      <div style={{display: 'flex', justifyContent: 'space-between', paddingRight: '10%'}}>
        <div style={{width: 120}}>
          <div className="aui">
            <img width="200px" src="https://upload.wikimedia.org/wikipedia/en/thumb/5/54/Delivery_Hero_food_delivery_logo.svg/1200px-Delivery_Hero_food_delivery_logo.svg.png"/>
          </div>
        </div>

        <form>

          <label style={{
            display: 'flex',
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
              <span>
                  Enter Engineer's Name Here
              </span>
            <input
              type="text"
              className="name-input center"
              value={this.props.name}
              onChange={e => this.props.setNameFn(e.target.value)}
              placeholder="Jane Doe"
            />
          </label>
        </form>

        <Help />
      </div>
    );
  }
}

export default Header;

import React from 'react';

const originalArray = [[-1, "People"], [250, 250, 25, 500, "Number of People (#)", "numBalls"], [5, 5, 0, 100, "Percent Infected (%)", "infectedPercent"], [-1, "Safety Precautions"], [65, 65, 0, 100, "Mask Wearage (%)", "maskPercent"], [50, 50, 0, 100, "Mask Effectiveness (%)", "maskEffectiveness"], [65, 65, 0, 100, "Percent Distancing (%)", "distancingPercent"], [6, 6, 0, 6, "Physical Distancing (ft)", "distancingDistance"], [35, 35, 0, 100, "Percent Quarantined (%)", "quarantinedPercent"], [-1, "Virus Details"], [75, 75, 0, 100, "Transmission Rate (%)", "transmissionRate"], [6, 6, 0, 12, "Transmission Range (ft)", "transmissionRange"], [10, 10, 0, 100, "Recovery Time (s)", "recoveryTime"]];

function Setting(props) {
  //placeholder={(props.minNum) + "-" + props.maxNum}
  return (
    <div className="setting-container">
      <p className="setting-name">{props.name}</p>
      <span className="input-container">
        <input type="range" className="range-slider" min={props.minNum} max={props.maxNum} value={props.realValue} onChange={(e) => props.changeText(e.target.value, props.index, props.minNum, props.maxNum)}></input>
        <input type="number" className="number-input" min={props.minNum} max={props.maxNum} value={props.frontValue} onChange={(e) => props.changeText(e.target.value, props.index, props.minNum, props.maxNum)}></input>
        <i className="fa fa-info-circle info-icon" aria-hidden="true" onClick={() => props.infoClick(props.index)}></i>
        {props.infoIndex === props.index &&
          <div className="info-container">
            <div className="info-arrow"></div>
            <h4 className="info-title">{props.name}</h4>
            <p className="info-text">Represents the number of people in the simulation. Can be set from 25 to 500 people.</p>
            <i className="fa fa-times info-close" onClick={() => props.infoClick(props.index)} aria-hidden="true"></i>
          </div>}
      </span>
    </div>
  );
}

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {optionArray: [[-1, "People"], [250, 250, 25, 500, "Number of People (#)", "numBalls"], [5, 5, 0, 100, "Percent Infected (%)", "infectedPercent"], [-1, "Safety Precautions"], [65, 65, 0, 100, "Mask Wearage (%)", "maskPercent"], [50, 50, 0, 100, "Mask Effectiveness (%)", "maskEffectiveness"], [65, 65, 0, 100, "Percent Distancing (%)", "distancingPercent"], [6, 6, 0, 6, "Physical Distancing (ft)", "distancingDistance"], [35, 35, 0, 100, "Percent Quarantined (%)", "quarantinedPercent"], [-1, "Virus Details"], [75, 75, 0, 100, "Transmission Rate (%)", "transmissionRate"], [6, 6, 0, 12, "Transmission Range (ft)", "transmissionRange"], [10, 10, 0, 100, "Recovery Time (s)", "recoveryTime"]], infoIndex: -1, showSettings: true};
  }

  changeText(e, index, minValue, maxValue) {
    var valueShown = e;
    var copyArray = this.state.optionArray.slice();
    if (isNaN(valueShown) || valueShown === "") {
      copyArray[index][0] = "";
      copyArray[index][1] = minValue;
    } else {
      valueShown = parseInt(valueShown);
      if (valueShown < maxValue + 1 && valueShown > minValue - 1) {
        copyArray[index][0] = valueShown;
        copyArray[index][1] = valueShown;
      } else if (valueShown < minValue) {
        copyArray[index][0] = valueShown;
        copyArray[index][1] = minValue;
      } else if (valueShown > maxValue) {
        copyArray[index][0] = valueShown;
        copyArray[index][1] = maxValue;
      }
    }
    this.setState({optionArray: copyArray}); 
    this.props.changeVar(copyArray[index][5], copyArray[index][1]);
  } 

  infoClick(index) {
    if (this.state.infoIndex === index) {
      this.setState({infoIndex: -1});
    } else {
      this.setState({infoIndex: index});
    }
  }

  renderSetting(element, index) {
    return (
      <div>
      {element[0] !== -1 && <Setting 
      key={element[4]}
      name={element[4]}
      minNum={element[2]}
      maxNum={element[3]}
      frontValue={element[0]}
      realValue={element[1]}
      index={index}
      infoIndex={this.state.infoIndex}
      changeText={(e, index, min, max) => this.changeText(e, index, min, max)}
      infoClick={() => this.infoClick(index)}/>}
      {element[0] === -1 &&
      <h4 className="settings-title"><span className="settings-title-span">{element[1]}</span></h4>
      }
      </div>
    );
  }

  resetSettings() {
    for (var i = 0; i < originalArray.length; i++) {
      this.props.changeVar(originalArray[i][5], originalArray[i][1]);
    }
    for (var i = 0; i < originalArray.length; i++) {
      this.changeText(originalArray[i][0], i, originalArray[i][2], originalArray[i][3]);
    }
  }

  drawCanvas() {
    const ctx = this.refs.sideCanvas.getContext("2d");
    ctx.fillStyle = "red";
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.arc(72, 50, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "blue";
    ctx.strokeStyle = "blue";
    ctx.beginPath();
    ctx.arc(72, 125, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "red";
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.arc(62, 200, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.moveTo(62 - 5, 200);
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(62, 200, 5 -1, 0, Math.PI, false);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "blue";
    ctx.strokeStyle = "blue";
    ctx.beginPath();
    ctx.arc(82, 200, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.moveTo(82 - 5, 200);
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(82, 200, 5 -1, 0, Math.PI, false);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "red";
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.arc(52, 275, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "gray";
    ctx.beginPath();
    ctx.arc(52, 275, 5 + 6, 0, 2 * Math.PI, false);
    ctx.stroke();

    ctx.fillStyle = "blue";
    ctx.strokeStyle = "blue";
    ctx.beginPath();
    ctx.arc(92, 275, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "gray";
    ctx.beginPath();
    ctx.arc(92, 275, 5 + 6, 0, 2 * Math.PI, false);
    ctx.stroke();

    ctx.fillStyle = "red";
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.arc(62, 350, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "blue";
    ctx.strokeStyle = "blue";
    ctx.beginPath();
    ctx.arc(82, 350, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }

  toggleSettings() {
    this.setState({showSettings: !this.state.showSettings})
  }

  componentDidMount() {
    for (var i = 0; i < this.state.optionArray.length; i++) {
      if (this.state.optionArray[i][0] !== -1) {
        this.props.changeVar(this.state.optionArray[i][5], this.state.optionArray[i][1]);
      }
      this.drawCanvas();
    }
  }

  /*input type=text*/
  render() {
    var hidden = "none";
    if (!this.state.showSettings) {
      hidden = "block";
    }
    return (
      <div className="sidebar-container">
        {this.state.showSettings &&
          <div>
            <h3 className="sidebar-title">Settings</h3>
            <div>
              {this.state.optionArray.map((i, index) => this.renderSetting(i, index))}
            </div>
            <button className="reset-setting-button" onClick={() => this.resetSettings()}><i className="fa fa-undo reset-icon" aria-hidden="true"></i><span className="reset-text">Reset Settings</span></button>
            <button className="other-setting-button" onClick={() => this.toggleSettings()}><i className="fa fa-info-circle sidebar-info-icon" aria-hidden="true"></i><span className="reset-text">Simulation Info</span></button>
          </div>
        }
        <div id="hidden-box" style={{display: hidden}}>
          <h3 className="sidebar-title">Simulation Info</h3>
          <canvas id="side-canvas" ref="sideCanvas" width="150" height="380" style={{width: 150, height: 380}}></canvas>
          <span id="key-container">
            <span style={{position: "absolute", top: "40px", left: "10px", width: "210px"}}>Infected Person</span>
            <span style={{position: "absolute", top: "115px", left: "10px", width: "210px"}}>Healthy Person</span>
            <span style={{position: "absolute", top: "190px", left: "10px", width: "210px"}}>Masked Person</span>
            <span style={{position: "absolute", top: "265px", left: "10px", width: "210px"}}>Physically Distanced Person</span>
            <span style={{position: "absolute", top: "330px", left: "10px", width: "210px"}}>Quarantined Person (unmoving)</span>
          </span>
          <button className="return-setting-button" onClick={() => this.toggleSettings()}><i className="fa fa-arrow-left sidebar-arrow-icon" aria-hidden="true"></i><span className="reset-text">Return to Settings</span></button>
        </div>
      </div>
    );
  }
}

export default Sidebar
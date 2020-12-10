import React from 'react';
import './App.css';
import Sidebar from './Sidebar';

/* sleep function
sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const wait = async () => {
  await this.sleep(500)  
}
wait()

*/

/* var reference
width: px
height: px
ballSpeed: px per frame (60 fps)
transmissionRange: px
transmissionRate: % per 60 frames
recoveryTime: seconds
*/

//After implementing the social distancing, there is a new bug where some balls are "invisible" and wont bounce off other balls. However, they will still transmit and bounce off the walls. Strange.
//Above problem is fixed. Remember to always update the arguments when the generate ball function is called in the update direction function after adding new variables to the generate ball function 

//infectedStats. Total infected, infected with mask, infected with distancing, infected with quarantine

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {width: 800, height: 500, numBalls: 100, ballArray: [], ballSpeed: 1, infectedPercent: 0, initialInfected: 1, transmissionRange: 5, transmissionRate: 50, recoveryTime: 10, maskPercent: 0, numMasks: 0, maskEffectiveness: 0, quarantinedPercent: 0, numQuarantined: 0, distancingPercent: 50, numDistancing: 5, distancingDistance: 3, start: false, pause: false, infectedStats: [0, 0, 0, 0], statNames: ["Total number of infected people", "Number of infected people with masks", "Number of infected people with distancing", "Number of infected people in quarantine"], percentageStats: [1, 1, 1, 1]};
  }

  sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  clearCanvas() {
    const ctx = this.refs.canvas.getContext("2d");
    ctx.clearRect(0, 0, this.state.width, this.state.height);
  }

  drawElements() {
    const ctx = this.refs.canvas.getContext("2d");
    for (var i = 0; i < this.state.ballArray.length; i++) {
      var ball = this.state.ballArray[i];
      ctx.fillStyle = ball.color;
      ctx.strokeStyle = ball.color;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      if (ball.mask) {
        ctx.moveTo(ball.x - ball.radius, ball.y);
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius -1, 0, Math.PI, false);
        ctx.fill();
        ctx.stroke();
      } if (ball.distancing > 0) {
        ctx.strokeStyle = "gray";
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius + ball.distancing, 0, 2 * Math.PI, false);
        ctx.stroke();
      }
    }
  }

  ballIntersection(ball1, ball2, airRange) {
    if (Math.pow((Math.pow(Math.abs(ball1.x - ball2.x), 2) + Math.pow(Math.abs(ball1.y - ball2.y), 2)), 1/2) <= ball1.radius + ball2.radius + airRange) {
      return true;
    }
    return false;
  }

  generateBall(color, radius, mask, quarantine, distancing) {
    while (true) {
      var newAngle = Math.floor(Math.random() * 360);
      var newBall = {x: Math.floor(Math.random() * (this.state.width - radius - radius + 1) + radius), y: Math.floor(Math.random() * (this.state.height - radius - radius + 1) + radius), radius: radius, speed: this.state.ballSpeed, angle: newAngle, oldAngle: newAngle, radians: newAngle * Math.PI/180, color: color, transmissionTimer: Math.floor(Math.random() * 60), mask: mask, recoveryTimer: 0, quarantine: quarantine, distancing: distancing}
      var works = true;
      for (var j = 0; j < this.state.ballArray.length; j++) {
        if (this.ballIntersection(newBall, this.state.ballArray[j], newBall.distancing + this.state.ballArray[j].distancing)) {
          works = false;
          break;
        }
      }
      if (works === true) {
        this.state.ballArray.push(newBall);
        break;     
      }
    }
  }

  updateDirection(ball, index) {
    if ((ball.x >= this.state.width - ball.radius) || (ball.x <= ball.radius)) {
      ball.angle = 180 - ball.angle;
    } if ((ball.y >= this.state.height - ball.radius) || (ball.y <= ball.radius)) {
      ball.angle = 360 - ball.angle;
    }
    var numCollisions = 0
    for (var i = 0; i < this.state.ballArray.length; i++) {
      if (i !== index) {
        var otherBall = this.state.ballArray[i];
        if (this.ballIntersection(ball, otherBall, ball.distancing + otherBall.distancing)) {
          if (otherBall.quarantine === true) {
            ball.angle = 180 + ball.angle;
          } else {
            ball.angle = otherBall.oldAngle;
          }
          numCollisions += 1
        }
      }
    }
    if (numCollisions >= 2) {
      this.state.ballArray.splice(index, 1);
      this.generateBall(ball.color, ball.radius, ball.mask, ball.quarantine, ball.distancing);
    }
    
    if (ball.x < ball.radius - 1) {
      ball.x = ball.radius;
    }
    if (ball.x > this.state.width - ball.radius + 1) {
      ball.x = this.state.width - ball.radius;
    }
    if (ball.y < ball.radius - 1) {
      ball.y = ball.radius;
    }
    if (ball.y > this.state.height - ball.radius + 1) {
      ball.y = this.state.height - ball.radius;
    }
    ball.radians = ball.angle * Math.PI/180;  
    ball.radians = ball.angle * Math.PI/180;
  }

  updateMotion(ball) {
    ball.transmissionTimer += 1;
    if (ball.color === "red") {
      ball.recoveryTimer += 1;
    }
    if (ball.quarantine === false) {
      ball.oldAngle = ball.angle;
      ball.x += Math.cos(ball.radians) * ball.speed;
      ball.y += Math.sin(ball.radians) * ball.speed;
    }
    if (ball.recoveryTimer >= this.state.recoveryTime * 60) {
      ball.color = "blue";
      ball.recoveryTimer = 0;
    }
  }

  updateTransmission(ball, index) {
    for (var i = 0; i < this.state.ballArray.length; i++) {
      if (i !== index) {
        var otherBall = this.state.ballArray[i];
        if (this.ballIntersection(ball, otherBall, this.state.transmissionRange)) {
          var num = Math.floor(Math.random() * 100);
          if (otherBall.mask === true) {
            num += Math.floor(this.state.maskEffectiveness);
          } if (ball.mask === true) {
            num += Math.floor(this.state.maskEffectiveness * 2);
          }
          if (ball.color === "red" && otherBall.transmissionTimer > 60 && num < this.state.transmissionRate) {
            otherBall.color = "red";
          } else if (ball.color === "red" && otherBall.transmissionTimer > 60 && num >= this.state.transmissionRate) {
            otherBall.transmissionTimer = 0;
          }
        }
      }
    }
  }

  updateStats(ball, index) {
    if (ball.color === "red") {
      this.state.infectedStats[0] += 1;
      if (ball.mask === true) {
        this.state.infectedStats[1] += 1;
      }
      if (ball.distancing === this.state.distancingDistance && this.state.distancingDistance !== 0) {
        this.state.infectedStats[2] += 1;
      }
      if (ball.quarantine === true) {
        this.state.infectedStats[3] += 1;
      }
    }
  }

  updateBalls() {
    for (var i = 0; i < this.state.ballArray.length; i++) {
      this.updateDirection(this.state.ballArray[i], i);
    }
    for (var j = 0; j < this.state.ballArray.length; j++) {
      this.updateMotion(this.state.ballArray[j]);
    }
    for (var k = 0; k < this.state.ballArray.length; k++) {
      this.updateTransmission(this.state.ballArray[k], k);
    }
    this.state.infectedStats = [0, 0, 0, 0];
    for (var l = 0; l < this.state.ballArray.length; l++) {
      this.updateStats(this.state.ballArray[l], l);
    }
    this.setState({infectedStats: this.state.infectedStats});
  }

  updateCanvas = () => {
    this.clearCanvas();
    this.drawElements();
    if (!this.state.pause) {
      this.updateBalls();
    }
    requestAnimationFrame(this.updateCanvas);
  }

  generateBalls = () => {
    var maskArray = [];
    while (maskArray.length < this.state.numMasks) {
      var num = Math.floor(Math.random() * this.state.numBalls)
      if (!maskArray.includes(num)) {
        maskArray.push(num);
      }
    }
    var quarantineArray = [];
    while (quarantineArray.length < this.state.numQuarantined) {
      var num2 = Math.floor(Math.random() * this.state.numBalls)
      if (!quarantineArray.includes(num2)) {
        quarantineArray.push(num2);
      }
    }
    var distancingArray = [];
    while (distancingArray.length < this.state.numDistancing) {
      var num3 = Math.floor(Math.random() * this.state.numBalls)
      if (!distancingArray.includes(num3)) {
        distancingArray.push(num3);
      }
    }
    var ballRadius = 5;
    for (var i = 0; i < this.state.numBalls; i++) {
      var newColor = "blue";
      var mask = false;
      var quarantine = false;
      var distancing = 0;
      if (i < this.state.initialInfected) {
        newColor = "red";
      }
      if (maskArray.includes(i)) {
        mask = true;
      }
      if (quarantineArray.includes(i)) {
        quarantine = true;
      }
      if (distancingArray.includes(i)) {
        distancing = this.state.distancingDistance;
      }
      this.generateBall(newColor, ballRadius, mask, quarantine, distancing);
    }
  }

  pauseClick() {
    this.setState({pause: true});
  }

  resumeClick() {
    this.setState({pause: false});
  }

  startClick() {
    this.setState({start: true});
    this.setState({pause: false});
    this.state.ballArray = [];
    this.state.numMasks = Math.floor(this.state.numBalls * this.state.maskPercent/100)
    this.state.initialInfected = Math.floor(this.state.numBalls * this.state.infectedPercent/100)
    if (this.state.initialInfected === 0 && this.state.infectedPercent != 0) {
      this.state.initialInfected = 1;
    }
    this.state.numQuarantined = Math.floor(this.state.numBalls * this.state.quarantinedPercent/100)
    this.state.numDistancing = Math.floor(this.state.numBalls * this.state.distancingPercent/100)
    
    var numDistancing = this.state.numDistancing;
    var numMasks = this.state.numMasks;
    var numQuarantined = this.state.numQuarantined;
    if (numDistancing === 0) {
      numDistancing = 1;
    } if (numMasks === 0) {
      numMasks = 1;
    } if (numQuarantined === 0) {
      numQuarantined = 1;
    }
    console.log(numDistancing);
    this.state.percentageStats = [this.state.numBalls, numMasks, numDistancing, numQuarantined];
    this.setState({percentageStats: this.state.percentageStats});

    this.generateBalls();
  }

  renderStats(statNum, index) {
    return (
      <div className="stat-box" key={index}>   
        <div className="stat-name">{this.state.statNames[index]}</div>
        <div className="stat-num">{statNum} ({Math.floor(statNum / this.state.percentageStats[index] * 100)}%)</div>
      </div>
    )
  }

  changeVar(variable, newValue) {
    this.setState({[variable]: newValue});
  }

  componentDidMount() {
    this.updateCanvas();
  }

  render() {
    return (
      <div id="center">
        <div id="all">
          <div id="canvas-container" style={{width: this.state.width, height: this.state.height}}>
            <canvas id="main-canvas" ref="canvas" width={this.state.width} height={this.state.height} style={{width: this.state.width, height: this.state.height}}/>
            {!this.state.start && <div id="start-screen" width={this.state.width} height={this.state.height} style={{width: this.state.width, height: this.state.height}}>
              <i className="fa fa-play big-play-button" aria-hidden="true" onClick={() => this.startClick()}></i>
              <h3 className="start-text" onClick={() => this.startClick()}>Press to Begin</h3>
            </div>}
            {this.state.start &&
            <div className="control-button-container">
              {this.state.pause && <button className="small-play-pause-button" onClick={() => this.resumeClick()}><i className="fa fa-play small-play-icon" aria-hidden="true"></i></button>}
              {!this.state.pause && <button className="small-play-pause-button" onClick={() => this.pauseClick()}><i className="fa fa-pause small-pause-icon" aria-hidden="true"></i></button>}
              <button className="small-restart-button" onClick={() => this.startClick()}><i className="fa fa-refresh small-restart-icon" aria-hidden="true"></i></button>
            </div>}
          </div>
          <Sidebar 
          changeVar={(variable, newValue) => this.changeVar(variable, newValue)}/>
          <div className="stat-bar">
            <h3 className="statbar -title">Statistics</h3>
            {this.state.infectedStats.map((a, b) => this.renderStats(a, b))}
          </div>
          <div className = "other-box">

          </div>
        </div>
      </div>
    );
  }
}

export default Game;

//the settings provided are grouped into three categories, which are people, which changes the number of ppl in the simulation, safety precautions, which changes the usage and effectiveness of safety precautions, and virus details, which changes the virus features.
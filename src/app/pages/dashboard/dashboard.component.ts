import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { Clipboard } from '@angular/cdk/clipboard';
import Swal from 'sweetalert2';

interface AgentData {
  name: string;
  input: string;
  result: number;
}

interface AlamatHistory {
  playerCount: number;
  adminFunds: number;
  playerPondo: number;
  totalProfit: number;
  totalOverBet: number;
  alamat: number;
  dutyProfit: number;
  lastSubmittedString?: string;
  lastSubmittedResults?: string;
  currentAlamat?: number;
  lastAlamat?: number;
  date?: Date;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  public stringData: string = '';
  public adminAgent: AgentData[] = [];
  public playerAgent: AgentData[] = [];
  public bannedAgent: AgentData[] = [];
  public zeroPlayerAgent: AgentData[] = [];
  public nonZeroPlayerAgent: AgentData[] = [];
  public negativePlayerAgent: AgentData[] = [];
  public submittedStringData: string = '';
  public stringResults: string = '';
  public negativePlayerString: string = '';
  public history: AlamatHistory;
  public dutyProfit: number = 0;
  public lastAlamat: number = 0;

  constructor(private clipboard: Clipboard, private dataService: DataService) {
    this.history = {
      playerCount: 0,
      adminFunds: 0,
      playerPondo: 0,
      totalProfit: 0,
      totalOverBet: 0,
      alamat: 0,
      dutyProfit: 0,
    };
  }

  ngOnInit(): void {
    this.getHistory();
  }
  saveHistory() {
    this.history.currentAlamat = this.history.alamat;
    this.history.lastAlamat = this.lastAlamat;
    this.history.lastSubmittedString = this.submittedStringData;
    this.history.lastSubmittedResults = this.stringResults;
    this.dutyProfit = this.history.currentAlamat - this.history.lastAlamat;
    this.history.dutyProfit = this.dutyProfit;
    this.dataService.saveHistory(this.history).subscribe((data: any) => {
      this.history = {
        ...data,
      };
    });
  }

  getHistory() {
    this.dataService.getHistory().subscribe((data: any) => {
      if (data) {
        this.history = {
          ...data,
        };
        this.lastAlamat = data.lastAlamat;
        this.stringResults = data.lastSubmittedResults;
        this.submittedStringData = data.lastSubmittedString;
        this.stringData = data.lastSubmittedString;
        this.dutyProfit = data.currentAlamat - data.lastAlamat;
        this.generateDataFunction ()
      }
    });
  }

  public generateData() {
    Swal.fire({
      title: 'Generate Data',
      icon: 'warning',
      text: 'Is the Data String in correct format?',
      showCancelButton: true,
      confirmButtonText: 'Okay',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.save()
      }
    });
  }

  generateDataFunction() {
    this.adminAgent = [];
    this.playerAgent = [];
    this.bannedAgent = [];
    this.zeroPlayerAgent = [];
    this.nonZeroPlayerAgent = [];
    this.negativePlayerAgent = [];

    this.submittedStringData = this.stringData;
    this.stringResults = '';
    this.negativePlayerString = '';
    let stringData = this.stringData.split('###########-RIP-###########');

    let playersString = stringData[0];
    let bannedPlayerString = stringData[1];

    this.sortAgents(playersString);
    this.sortAgents(bannedPlayerString);
    this.sortZeroAndNonZeroPlayers(this.playerAgent);
    this.sortAgentsAlphabetically();
    this.calculateAdminPondo(this.adminAgent);
    this.calculatePlayerPondo(this.playerAgent);
    this.calculateTotalProfit();
    this.calculateTotalOverBet(this.playerAgent);
    this.calculateTotalOverBet(this.bannedAgent);
    this.calculateAlamat();
    this.createStringResults();
    this.createNegativeStringResults();
    this.stringData = '';
  }

  save() {
    this.history = {
      playerCount: 0,
      adminFunds: 0,
      playerPondo: 0,
      totalProfit: 0,
      totalOverBet: 0,
      alamat: 0,
      dutyProfit: 0,
    };

    this.generateDataFunction();
    this.saveHistory();
  }

  createNegativeStringResults() {
    this.negativePlayerString += this.generateStringResults(
      this.negativePlayerAgent
    );
    this.negativePlayerString = this.negativePlayerString.trim()
  }

  createStringResults() {
    this.history.date = new Date();
    this.stringResults += this.generateStringResults(this.adminAgent);
    this.stringResults += this.generateStringResults(this.nonZeroPlayerAgent);
    this.stringResults += this.generateStringResults(this.zeroPlayerAgent);
    this.stringResults += '\n###########-RIP-###########\n~';
    this.stringResults += this.generateStringResults(this.bannedAgent);
  }

  sortAgentsAlphabetically() {
    this.nonZeroPlayerAgent.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });

    this.zeroPlayerAgent.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });

    this.bannedAgent.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });

    this.negativePlayerAgent.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
  }

  sortAgents(stringData: string) {
    let agents: string[] = [];
    agents = stringData.split('~');
    agents = agents.filter(function (agent) {
      return agent.trim() != '';
    });

    agents.forEach((agent) => {
      let agentDataStringArr: string[] = agent.split('=');
      let agentData = this.generateAgentResults(
        agentDataStringArr[0],
        agentDataStringArr[1]
      );
      this.filterAgents(agentData);
    });
  }

  filterAgents(agentData: AgentData) {
    if (agentData.name.includes('0')) {
      this.adminAgent.push(agentData);
    } else if (agentData.name.includes('BANNED')) {
      this.bannedAgent.push(agentData);
    } else {
      this.playerAgent.push(agentData);
    }
  }

  sortZeroAndNonZeroPlayers(agentData: AgentData[]) {
    agentData.forEach((agent) => {
      if (agent.result === 0) {
        this.zeroPlayerAgent.push(agent);
      } else {
        if (agent.result < 0) {
          this.negativePlayerAgent.push(agent);
        }
        this.nonZeroPlayerAgent.push(agent);
      }
    });
    this.history.playerCount = this.nonZeroPlayerAgent.length;
  }

  generateAgentResults(name: string, inputs: string): AgentData {
    let inputWithSpaces = this.generateStringWithSpaces(inputs);
    let agentData: AgentData = {
      name: name,
      input: inputWithSpaces,
      result: this.generateResult(inputWithSpaces),
    };
    return agentData;
  }

  generateResult(data: string): number {
    let numbers = data.split(' ');
    let result = 0;
    numbers.forEach((dataNumber) => {
      if (dataNumber !== '') {
        result += parseInt(dataNumber);
      }
    });
    return result;
  }

  generateStringWithSpaces(data: string): string {
    const argsWithOnlyMath = data.replace(/[^\d+\-\/*x()>^=]/g, ' ');
    const spacedArgs = argsWithOnlyMath
      .replace(/\s*(\D+)\s*/g, ' $1') // add spaces
      .replace(/ +/g, ' ') // ensure no duplicate spaces
      .replace(/\( /g, '(') // remove space after (
      .replace(/ \)/g, ')'); // remove space before )
    return spacedArgs;
  }

  generateStringResults(agentDatas: AgentData[]): String {
    let result = '';
    agentDatas.forEach((agentData) => {
      result += `${agentData.name}= ${agentData.result}\n~`;
    });
    return result;
  }

  calculateAdminPondo(agentData: AgentData[]) {
    let adminPondo = 0;
    agentData.forEach((agent) => {
      adminPondo += agent.result;
    });
    this.history.adminFunds = Math.abs(adminPondo);
  }

  calculatePlayerPondo(agentData: AgentData[]) {
    let playerPondo = 0;
    agentData.forEach((agent) => {
      if (agent.result > 0) {
        playerPondo += agent.result;
      }
    });
    this.history.playerPondo = Math.abs(playerPondo);
  }

  calculateTotalProfit() {
    this.history.totalProfit =
      this.history.adminFunds - this.history.playerPondo;
  }

  calculateTotalOverBet(agentData: AgentData[]) {
    let totalOverBet = 0;
    agentData.forEach((agent) => {
      if (agent.result < 0) {
        totalOverBet -= agent.result;
      }
    });
    this.history.totalOverBet -= totalOverBet;
  }

  calculateAlamat() {
    this.history.alamat =
      this.history.totalProfit + Math.abs(this.history.totalOverBet);
  }

  public copyResults() {
    this.clipboard.copy(this.stringResults);
    Swal.fire({
      icon: 'success',
      title: 'Result copied',
      showConfirmButton: false,
      timer: 1500,
    });
  }
}

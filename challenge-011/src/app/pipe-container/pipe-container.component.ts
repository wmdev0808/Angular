import { Component } from '@angular/core';

export interface Server {
  instanceType: string;
  name: string;
  status: string;
  started: Date;
}

@Component({
  selector: 'app-pipe-container',
  templateUrl: './pipe-container.component.html',
  styleUrls: ['./pipe-container.component.scss'],
})
export class PipeContainerComponent {
  appStatus = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('stable');
    }, 2000);
  });

  servers: Server[] = [
    {
      instanceType: 'medium',
      name: 'Production',
      status: 'stable',
      started: new Date(15, 1, 2017),
    },
    {
      instanceType: 'large',
      name: 'User Database',
      status: 'stable',
      started: new Date(15, 1, 2017),
    },
    {
      instanceType: 'small',
      name: 'Development Server',
      status: 'offline',
      started: new Date(15, 1, 2017),
    },
    {
      instanceType: 'small',
      name: 'Testing Environment Server',
      status: 'critical',
      started: new Date(15, 1, 2017),
    },
  ];

  filteredStatus = '';
  getStatusClasses(server: Server) {
    return {
      'list-group-item-success': server.status === 'stable',
      'list-group-item-warning': server.status === 'offline',
      'list-group-item-danger': server.status === 'critical',
    };
  }

  onAddServer() {
    this.servers.push({
      instanceType: 'small',
      name: 'New Server',
      status: 'stable',
      started: new Date(15, 1, 2017),
    });
  }
}

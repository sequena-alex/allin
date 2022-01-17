import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HistoryComponent } from './pages/history/history.component';

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    pathMatch: "full"
  },
  {
    path: "history",
    component: HistoryComponent,
    pathMatch: "full"
  },
  {
    path: "**",
    redirectTo: "dashboard"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

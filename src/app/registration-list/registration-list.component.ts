import { Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../models/user.model';
import { ApiService } from '../services/api.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { NgConfirmService } from 'ng-confirm-box';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-registration-list',
  templateUrl: './registration-list.component.html',
  styleUrls: ['./registration-list.component.scss']
})
export class RegistrationListComponent implements OnInit {

  public dataSource!: MatTableDataSource<User>
  public users!: User[];

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  displayedColumns: string[] = ['index', 'id','firstName', 'lastName', 'email', 'mobile', 'bmiResult', 'gender', 'package', 'enquiryDate', 'action']

  constructor(
    private apiService: ApiService,
    private router: Router,
    private confirmService: NgConfirmService,
    private toastService: NgToastService
  ) { }

  ngOnInit(): void {
    this.getUsers()
  }

  getUsers() {
    this.apiService.getRegisteredUser().subscribe({
      next: (res) => {
        this.users = res
        this.dataSource = new MatTableDataSource(this.users)
        this.dataSource.paginator = this.paginator
        this.dataSource.sort = this.sort
      }
    })
  }

  edit(id: number) {
    this.router.navigate(['update', id]);
  }

  delete(id: number) {
    this.confirmService.showConfirm('Are you sure want to delete?',
    // If Yes clicked
    ()=> {
      this.apiService.deleteRegisteredUser(id).subscribe({
        next: (res) => {
          this.toastService.success({ detail: 'Success', summary: 'Enquiry Deleted Successfully', duration: 3000 })
          this.getUsers()
        },
        error: (err) => {
          this.toastService.error({ detail: 'ERROR', summary: 'Something went wrong!', duration: 3000 });
        }
      })
    },
    // If No clicked
    ()=> {

    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}

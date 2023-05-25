import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../models/user.model';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute
  ) { }

  userDetails!: User
  public userId!: number

  ngOnInit(): void {
    this.getUserId()
    this.fetchUserDetails(this.userId)
  }

  getUserId() {
    this.activatedRoute.params.subscribe({
      next: (val) => {
        this.userId = val['id']
      }
    })
  }

  fetchUserDetails(id: number) {
    this.apiService.getRegisteredUserById(id).subscribe({
      next: (res) => {
        this.userDetails = res
        // console.log(this.userDetails)
      }
    })
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user.model';

@Component({
  selector: 'app-create-registration',
  templateUrl: './create-registration.component.html',
  styleUrls: ['./create-registration.component.scss']
})
export class CreateRegistrationComponent implements OnInit {

  public packages: string[] = ['Monthly', 'Quarterly', 'Yearly']
  public importantList: string[] = [
    'Toxic fat reduction',
    'Energy and Endurance',
    'Building lean muscle',
    'Healthier digestive system',
    'Sugar craving body',
    'Fitness'
  ]

  public registerForm!: FormGroup
  userIdToUpdate!: number
  isUpdateActive: boolean = false

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private toastService: NgToastService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.maxLength(15), Validators.required]],
      lastName: ['', [Validators.maxLength(15), Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      mobile: ['', [Validators.pattern(/^(\+\d{1,3}[- ]?)?\d{10}$/), Validators.required]],
      weight: ['', [Validators.maxLength(3), Validators.required]],
      height: ['', [Validators.required]],
      bmi: [''],
      bmiResult: [''],
      gender: [''],
      requireTrainer: [''],
      package: [''],
      important: [''],
      haveGymBefore: [''],
      enquiryDate: [''],
    });

    this.registerForm.controls['height'].valueChanges.subscribe({
      next: (res) => {
        this.calculateBMI(res);
      }
    })

    this.activatedRoute.params.subscribe({
      next: (val) => {
        // console.log(val['id'])
        this.userIdToUpdate = val['id'];
        this.apiService.getRegisteredUserById(this.userIdToUpdate).subscribe({
          next: (res) => {
            this.isUpdateActive = true
            this.fillFromToUpdate(res);
          }
        })
      }
    })
  }

  submit() {
    // console.log(this.registerForm.value)
    this.apiService.postRegistration(this.registerForm.value).subscribe({
      next: (res) => {
        this.toastService.success({ detail: 'Success', summary: 'Enquiry Added', duration: 3000 })
        this.registerForm.reset()
        this.registerForm.controls['firstName'].setErrors(null)
        this.registerForm.controls['lastName'].setErrors(null)
        this.registerForm.controls['email'].setErrors(null)
        this.registerForm.controls['mobile'].setErrors(null)
        this.registerForm.controls['weight'].setErrors(null)
        this.registerForm.controls['height'].setErrors(null)
      }
    })
  }

  calculateBMI(heightValue: number) {
    const weight = this.registerForm.value.weight
    const height = heightValue
    const bmi = weight / (height * height)
    this.registerForm.controls['bmi'].patchValue(bmi)

    if (bmi < 18.5) {
      this.registerForm.controls['bmiResult'].patchValue('Underweight')
    } else if (bmi >= 18.5 && bmi < 25) {
      this.registerForm.controls['bmiResult'].patchValue('Normal')
    } else if (bmi >= 25 && bmi < 30) {
      this.registerForm.controls['bmiResult'].patchValue('overweight')
    } else {
      this.registerForm.controls['bmiResult'].patchValue('Obese')
    }
    // console.log(this.registerForm.controls['bmiResult'].value) 
  }

  fillFromToUpdate(user: User) {
    this.registerForm.patchValue(user)
  }

  update() {
    this.apiService.updateRegisteredUser(this.registerForm.value, this.userIdToUpdate).subscribe({
      next: (res) => {
        this.toastService.success({ detail: 'Success', summary: 'Enquiry Updated', duration: 3000 })
        this.registerForm.reset()
        this.router.navigate(['list'])
      }
    })
  }

}

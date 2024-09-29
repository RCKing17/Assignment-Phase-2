import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}
const BACKEND_URL = 'http://localhost:3000/';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})

// TODO: do the real data retrieval!!

export class GroupsComponent implements OnInit {
  groups: string[] = [];
  newGroupName: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  // ngOnInit(): void {
  //   if (!sessionStorage.getItem('userid')) {
  //     this.router.navigate(['/login']);
  //     return;
  //   }
    
  //   // Initialize with some default groups
  //   this.groups = ['Admin Group', 'User Group', 'Guest Group'];
  // }

  // addGroup(): void {
  //   if (this.newGroupName.trim()) {
  //     this.groups.push(this.newGroupName.trim());
  //     this.newGroupName = ''; // Clear the input field
  //   }
  // }

  // removeGroup(group: string): void {
  //   this.groups = this.groups.filter(g => g !== group);
  // }
  ngOnInit(): void {
    this.loadGroups();  // Fetch existing groups on component load
  }

  // Load existing groups from the backend
  loadGroups(): void {
    this.http.get<string[]>('http://localhost:3000/groups').subscribe(
      (data) => {
        this.groups = data;  // Assign groups from response
      },
      (error) => {
        console.error('Error loading groups:', error);
      }
    );
  }

  // Add a new group to the backend
  addGroup(): void {
    if (this.newGroupName.trim() !== '') {
      this.http.post<string>('http://localhost:3000/groups', { groupName: this.newGroupName }).subscribe(
        (groupName) => {
          this.groups.push(groupName);  // Add new group to the list
          this.newGroupName = '';  // Clear input field
        },
        (error) => {
          console.error('Error adding group:', error);
        }
      );
    }
  }

  // Remove a group from the backend
  removeGroup(group: string): void {
    this.http.delete(`http://localhost:3000/groups/${group}`).subscribe(
      () => {
        this.groups = this.groups.filter(g => g !== group);  // Remove group from the list
      },
      (error) => {
        console.error('Error removing group:', error);
      }
    );
  }
}

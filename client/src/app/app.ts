import { Component, inject } from '@angular/core';
import { Nav } from '../layout/nav/nav';
import { Router, RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';


@Component({
  imports: [Nav, RouterOutlet, NgClass],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App  {
  protected router = inject(Router)
  


}

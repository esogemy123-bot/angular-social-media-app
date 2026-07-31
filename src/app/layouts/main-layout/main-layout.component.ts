import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";
import { PostDetailsComponent } from "../../features/post-details/post-details.component";

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, NavbarComponent, PostDetailsComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent {

}

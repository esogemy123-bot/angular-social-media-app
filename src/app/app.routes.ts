import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { ForgetPasswordComponent } from './features/forget-password/forget-password.component';
import { FeedComponent } from './features/feed/feed.component';
import { ProfileComponent } from './features/profile/profile.component';
import { NotificationComponent } from './features/notification/notification.component';
import { ChangePasswordComponent } from './features/change-password/change-password.component';
import { ErrorComponent } from './features/error/error.component';
import { MyPostsComponent } from './features/my-posts/my-posts.component';
import { SavedPostsComponent } from './features/saved-posts/saved-posts.component';
import { authGuard } from './core/auth/guard/auth-guard';
import { guestGuard } from './core/auth/guard/guest-guard';
import { PostDetailsComponent } from './features/post-details/post-details.component';
export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent, title: 'Log In', canActivate: [guestGuard] },
      {
        path: 'register',
        component: RegisterComponent,
        title: 'New Account',
        // canActivate: [guestGuard],
      },
      { path: 'forget', component: ForgetPasswordComponent, canActivate: [guestGuard] },
      // {path:"**",component:ErrorComponent,title:'404'},
    ],
  },
  {
    path: 'main',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'feed', pathMatch: 'full' },
      {
        path: 'feed',
        component: FeedComponent,
        title: 'TimeLine Page',
        canActivate: [authGuard],
      },
      {
        path: 'profile',
        component: ProfileComponent,
        title: 'Profile Page',
        canActivate: [authGuard],
        children: [
          { path: '', redirectTo: 'myPosts', pathMatch: 'full' },
          { path: 'myPosts', component: MyPostsComponent },
          { path: 'savedPosts', component: SavedPostsComponent },
        ],
      },
      {
        path: 'profile/:id',
        component: ProfileComponent,
        title: 'Profile Page',
        canActivate: [authGuard],
        children: [
          { path: '', redirectTo: 'myPosts', pathMatch: 'full' },
          { path: 'myPosts', component: MyPostsComponent },
          { path: 'savedPosts', component: SavedPostsComponent },
        ],
      },
      {
        path: 'notification',
        component: NotificationComponent,
        title: 'Notifications',
        canActivate: [authGuard],
      },
      {
        path: 'change',
        component: ChangePasswordComponent,
        title: 'Settings',
        canActivate: [authGuard],
      },
      { path: 'details/:id', component: PostDetailsComponent, title: 'Details Page' },
      // {path:"**",component:ErrorComponent,title:'404'}
    ],
  },
];

import {AuthService, FacebookLoginProvider} from 'angular-6-social-login';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Helper} from '../util/helper';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {Entity} from '../enum/entities.enum';
import {User} from '../entities/user';

export const users = [{
  email: 'malindakpt@yahoo.com',
  id: '2431221976918023',
  image: 'https://graph.facebook.com/2431221976918023/picture?type=normal',
  name: 'Malinda Kumarasinghe'
}, {
  email: 'gayathree1111@gmail.com',
  id: '2293860684019373',
  image: 'https://graph.facebook.com/2293860684019373/picture?type=normal',
  name: 'Gayathree Sewwandi'
}];

@Injectable()
export class AuthenticationService {

    public authStatus: Observable<any>;
    public imageURL: string;
    public devAuthSubject;
    constructor(
      private socialAuthService: AuthService,
      private router: Router) {

      if (environment.production) {
      // if (true) {
        this.authStatus = this.socialAuthService.authState;
        this.socialAuthService.authState.subscribe((sts: any) => {
          if (sts) {
            Helper.user = sts;
            this.router.navigate(['secure']);
            console.log('Already logged in : ', sts);
          } else {
            this.router.navigate(['login']);
            console.log('Not logged in : ', sts);
          }
        });
      } else {
        const userID = localStorage.getItem('userID');
        let user;
        if (userID) {
          user = users[Number(userID)];
        } else {
          user = users[0];
          localStorage.setItem('userID', '0');
        }

        this.devAuthSubject = new BehaviorSubject(user);
        this.authStatus = this.devAuthSubject;
        Helper.user = user;
        console.log('Running in DEV mode');
        this.router.navigate(['secure']);
      }
    }
    private setAutoHUBUser(): void {
      // this.dataService.getEntity(Entity.users, 'id', Helper.user.id, (user: User) => {
      //   Helper.user = user;
      // });
    }

    public login(): void {
        const socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
        this.socialAuthService.signIn(socialPlatformProvider).then(
            (sts: any) => {
                Helper.user = sts;
                console.log('FB sign in data : ', sts);
                this.imageURL = sts.image;
                this.router.navigate(['secure']);
            }
        );
    }

    public logout(): void {
        this.socialAuthService.signOut().then(
            (userData) => {
                Helper.user = null;
                this.router.navigate(['login']);
            }
        );
    }
}

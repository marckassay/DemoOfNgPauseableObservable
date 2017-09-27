import { Observable, Subscription, AnonymousSubject } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';

export enum IntervalState {
    Countdown,
    Countup,
    Completed
}

export interface IIntervalEmission {
    readonly state: IntervalState;
    readonly count: number;
    connect?: any;
}

export class Index 
{
    source: ConnectableObservable<IIntervalEmission>;
    publication: Observable<any>;
    pauser: Subject<boolean>;
    paused: boolean = false;

    constructor() {
        this.initializeTimer();

        this.getStart().addEventListener('click',()=>this.start());
        this.getPause().addEventListener('click',()=>this.pause());
        this.getReset().addEventListener('click',()=>this.reset());
    }

    initializeTimer() {
        const source = Observable.create((observer: any) => {
            observer.next( Observable.timer(0, 500)
            .startWith(20)
            .map(val => { IntervalState.Countdown, val--}) );

             observer.next( Observable.timer(0, 500)
            .map(val => { IntervalState.Countup, val++}) );
        }).concat().publish();

        this.pauser = new Subject<boolean>();

        this.publication = (this.pauser as Observable<boolean>)
                            .switchMap( (paused) => (paused == true) ? Observable.never() : source )
                            .take( 40 );

        this.subscribeTimer();
    }

    subscribeTimer(): void {
        this.publication.subscribe((e: any) => {
            console.log(e);
        }, (err) => {
            console.log(err);
        }, () => {
            console.log("Timer completed!");
        });
    }

    start(): void {
        this.getStart().setAttribute('disabled', 'true');
        this.source.connect();
        console.log("start");
        this.pauser.next(false);

    }
    pause(): void {
        this.paused = (this.paused) ? false:true;
        this.getPause().innerHTML = (this.paused)? 'UNPAUSE':'PAUSE';
        this.pauser.next(this.paused);
    }
    reset(): void {
        this.getStart().setAttribute('disabled', 'false');
        //this.pauser.next(true);
    }

    private getStart() {
        return document.getElementById('start');
    }
    private getPause() {
        return document.getElementById('pause');
    }
    private getReset() {
        return document.getElementById('reset');
    }
}
export default new Index();
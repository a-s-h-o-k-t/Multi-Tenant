import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil, tap } from 'rxjs';

@Component({
  template: '',
})
export abstract class BaseComponent implements OnInit, OnDestroy {
  hasInitialized = false;
  hasInitialized$ = new BehaviorSubject(false);

  protected dispose = new Subject<void>();

  abstract init(): Observable<unknown>;

  destroy?(): void;

  ngOnInit(): void {
    this.init()
      .pipe(
        tap(() => {
          this.hasInitialized = true;
          this.hasInitialized$.next(true);
        }),
        takeUntil(this.dispose),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.dispose.next();
    this.dispose.complete();
    this.destroy?.();
  }
}

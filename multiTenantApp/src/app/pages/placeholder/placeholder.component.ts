import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-placeholder',
  templateUrl: './placeholder.component.html',
  styleUrls: ['./placeholder.component.scss'],
  standalone: false
})
export class PlaceholderComponent implements OnInit {
  private route = inject(ActivatedRoute);
  pageName: string = '';

  ngOnInit(): void {
    this.pageName = this.route.snapshot.url[0]?.path || 'Page';
    this.pageName = this.pageName.charAt(0).toUpperCase() + this.pageName.slice(1);
  }
}

import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import * as randomWords from 'random-words';
import {FormControl, FormGroup, Validators} from '@angular/forms';

export interface IEntry {
  name: string;
  description: string;
  status: string;
}
export class Paginate {
  current: number;
  totalPages: number[];
  visiblePages: number[];
  nextbuttom: boolean;
  prevbuttom: boolean;
  visibleCount = 10;
  constructor(lenght: number, items: number) {
    this.init(lenght, items);
  }
  clickNext() {
    this.visiblePages = this.totalPages.slice(this.visiblePages[this.visibleCount - 1],
      this.visiblePages[this.visibleCount - 1] + this.visibleCount);
    console.log(this.visiblePages);
    console.log(this.totalPages);
    this.initJumpButtons();
  }
  clickPrew() {
    const startIndex = this.visiblePages[0] - this.visibleCount > 0 ? this.visiblePages[0] - this.visibleCount : 0;
    this.visiblePages = this.totalPages.slice(startIndex, startIndex + this.visibleCount);
    this.initJumpButtons();
  }
  init(lenght: number, items: number) {
    this.current = 0;
    this.totalPages = Array.from(Array(Math.ceil(lenght / items)).keys());
    this.visiblePages = this.totalPages.slice(0, this.visibleCount);
    this.initJumpButtons();
  }
  initJumpButtons() {
    this.nextbuttom = this.visiblePages[this.visiblePages.length - 1] !== this.totalPages.length - 1;
    this.prevbuttom = this.visiblePages[0] !== 0;
  }
  setPage(index: number) {
    this.current = index;
  }
}
@Component({
  selector: 'app-test1',
  templateUrl: './test1.component.html',
  styleUrls: ['./test1.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Test1Component implements OnInit {

  data: IEntry[];
  page = 0;
  pageSize = 20;
  emptyArray = new Array(1000);
  searchForm: FormGroup;
  filteredData: number[];
  public Pagination: Paginate;

  constructor() {}

  ngOnInit() {
    this.data = [];
    this.searchForm = new FormGroup({
      'filter': new FormControl('', [Validators.required])
    });
    this.data = new Array(10000).fill(undefined).map(x => x = {
      name: randomWords({exactly: 3, join: ' '}),
      description: randomWords({exactly: 100, join: ' '}),
      status: ['new', 'submitted', 'failed'][Math.floor(Math.random() * 3)]
    });
    this.filteredData = Array.from(this.data.keys());
    this.Pagination = new Paginate(this.filteredData.length, this.pageSize);
    this.searchForm.controls['filter'].valueChanges.subscribe(res => {
      this.updateFilter(res);
      this.Pagination.init(this.filteredData.length, this.pageSize);
    });
  }

  get filter() { return this.searchForm.get('filter'); }

  updateFilter(filter) {
    this.filteredData = [];
    if (this.searchForm.valid) {
      const filters = filter.split(' ');
      filters.filter(x => {
        return x !== '';
      });
      // this.filteredData = this.data.filter(entry => {
      //   return entry.name.indexOf(filter) !== -1 || entry.description.indexOf(filter) !== -1 || entry.status.indexOf(filter) !== -1;
      // });
      for (let length = 0; length < 10000; length++) {
        const set = this.data[length].name + ' ' + this.data[length].description + ' ' + this.data[length].status;
        let filterLength = filters.length;
        this.filteredData.push(length);
        while (filterLength--) {
          if (!set.match(filters[filterLength])) {
            this.filteredData.pop();
            break;
          }
        }
      }
    }
  }
}

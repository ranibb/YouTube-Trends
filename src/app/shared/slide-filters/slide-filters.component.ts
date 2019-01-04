import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith, map } from 'rxjs/internal/operators';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';

import { appConfig } from 'appConfig';
import { ICountryListModel } from '@shared/models/country-list.interface';
import { ICategoryListInterface } from '@shared/models/category-list.interface';
import { ContextService } from '@shared/context.service';

const STORAGE_KEY = 'youtube_filters';

@Component({
  selector   : 'app-slide-filters',
  templateUrl: './slide-filters.component.html',
  styleUrls  : [ './slide-filters.component.scss' ]
})
export class SlideFiltersComponent implements OnInit {

  @Input()
  public filterSlide: any;

  public countryFormControl: FormControl = new FormControl();
  public countryList$: Observable<ICountryListModel[]>;
  public countries: ICountryListModel[] = appConfig.countryList;
  public countryCode: any = '';

  public categoryFormControl: FormControl = new FormControl();
  public categoriesList$: Observable<ICategoryListInterface[]>;
  public categories: ICategoryListInterface[] = [
    {name: 'Film & Animation', id: 1},
    {name: 'Autos & Vehicles', id: 2},
    {name: 'Music', id: 10},
    {name: 'Pets & Animals', id: 4}
  ];
  public categoryId: any = '';

  public videosPerPageFormControl: FormControl = new FormControl();
  public defaultVideosOnPage: number = appConfig.maxVideosToLoad;
  public count: number;

  constructor(private appContext: ContextService,
              private router: Router,
              @Inject(SESSION_STORAGE) public storage: StorageService) {

    this.countryList$ = this.countryFormControl.valueChanges
      .pipe(
        startWith(''),
        map((country) => country ? this.filterCountries(country) : this.countries.slice())
      );

    this.categoriesList$ = this.categoryFormControl.valueChanges
      .pipe(
        startWith(''),
        map((category) => category ? this.filterCategories(category) : this.categories.slice())
      );
  }

  private filterCountries(value: string): ICountryListModel[] {
    const filterValue = value.toLowerCase();
    return this.countries.filter((country) => country.name.toLowerCase().indexOf(filterValue) === 0);
  }

  private filterCategories(value: string): ICategoryListInterface[] {
    const filterValue = value.toLowerCase();
    return this.categories.filter((category) => category.name.toLowerCase().indexOf(filterValue) === 0);
  }

  public ngOnInit() {

    this.setDefaults();

    this.countryFormControl.valueChanges
      .subscribe((value) => {
      const country = appConfig.countryList.find((obj) => obj.name === value);
      if (country) {
        this.loadCountryTrend(country);
      }
    });

    this.categoryFormControl.valueChanges
      .subscribe((value) => {
        const category = this.categories.find((item) => item.name === value);
        if (category) {
          this.loadCategoryTrend(category);
        }
      });

    this.videosPerPageFormControl.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged())
      .subscribe((count) => this.onChangeVideosPerPage(count));
  }

  public loadCountryTrend(country) {
    this.countryCode = country.code;
    this.router.navigate(['/youtube'], { queryParams: { count: this.count, country: this.countryCode, category: this.categoryId } });
  }

  public loadCategoryTrend(category) {
    this.categoryId = category.id;
    this.router.navigate(['/youtube'], { queryParams: { count: this.count, country: this.countryCode, category: this.categoryId } });
  }

  public onChangeVideosPerPage(count: number) {
    this.count = count;
    this.router.navigate(['/youtube'], { queryParams: { count: this.count, country: this.countryCode, category: this.categoryId } });
    this.saveState();
  }

  public saveState() {
    this.storage.set(STORAGE_KEY, {
       videosOnPage: this.count
     });
  }

  private setDefaults() {
    const savedFilters = this.storage.get(STORAGE_KEY);

    if (savedFilters) {
      console.log(savedFilters);
      this.appContext.videosCountPerPage.next(savedFilters.videosOnPage);
    }

    const defaultCountry = this.countries.find((country) =>
      country.code === appConfig.defaultRegion).name;
    const defaultCategory = this.categories.find((country) =>
      country.id === appConfig.defaultCategoryId).name;

    this.countryFormControl.setValue(defaultCountry);
    this.categoryFormControl.setValue(defaultCategory);

    if (!this.count) {
      this.appContext.videosCountPerPage.subscribe((count) => {
        this.videosPerPageFormControl.setValue(count);
        this.onChangeVideosPerPage(count);
      });
    }
  }
}

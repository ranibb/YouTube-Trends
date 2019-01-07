import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute, RouterEvent } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith, map, skip, take } from 'rxjs/internal/operators';

import { appConfig } from 'appConfig';
import { ICountryListModel } from '@shared/models/country-list.interface';
import { ICategoryListInterface } from '@shared/models/category-list.interface';
import { ContextService } from '@shared/context.service';

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
  public categories: ICategoryListInterface[] = [];
  public categoriesSubscription: Subscription;
  public categoryId: any = '';

  public videosPerPageFormControl: FormControl = new FormControl();
  public defaultVideosOnPage: number = appConfig.maxVideosToLoad;
  public count: number;

  constructor(private appContext: ContextService,
              private router: Router,
              private route: ActivatedRoute) {

    this.countryList$ = this.countryFormControl.valueChanges
      .pipe(
        startWith(''),
        map((country) => country ? this.filterCountries(country) : this.countries.slice())
      );

    this.categoriesSubscription = this.appContext.videosCategoryList
      .subscribe((categories) => {
        this.updateCategories(categories);
      });
  }

  public updateCategories(categories) {
    this.categories = categories;
    console.log(this.categories);
    if (categories.length === 0) {
      this.categoryFormControl.setValue('No Categories for this country');
      this.defaultRoute();
    }

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
        this.countryCode = country.code;
        this.router.navigate(['/youtube'], { queryParams: { count: this.count, country: this.countryCode, category: this.categoryId } });
      }
    });

    this.categoryFormControl.valueChanges
      .subscribe((value) => {
        const category = this.categories.find((item) => item.name === value);
        if (category) {
          this.categoryId = category.id;
          this.router.navigate(['/youtube'], { queryParams: { count: this.count, country: this.countryCode, category: this.categoryId } });
        }
      });

    this.videosPerPageFormControl.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged())
      .subscribe((count) => {
        this.count = count;
        this.router.navigate(['/youtube'], { queryParams: { count: this.count, country: this.countryCode, category: this.categoryId } });
        // this.saveState();
      });
  }

  private setDefaults() {

    this.router.events.subscribe((event: RouterEvent) => {
      if (event.url === '/youtube' || event.url === '/') {
        this.defaultRoute();
      }
    });

    this.route.queryParams
    .pipe(skip(1), take(1))
    .subscribe((params) => {
      if (params.hasOwnProperty('count') && params.hasOwnProperty('country') && params.hasOwnProperty('category')) {
        this.countryCode = params.country;
        const defaultCountry = this.countries.find((country) => country.code === this.countryCode).name;
        this.countryFormControl.setValue(defaultCountry);

        this.categoryId = params.category;

        this.appContext.videosCategoryList.subscribe((categories) => {
          if (categories.length) {
            // tslint:disable-next-line:triple-equals
            const defaultCategory = categories.find((category) => category.id == this.categoryId).name;
            this.categoryFormControl.setValue(defaultCategory);
          }
        });

        this.count = params.count;
        this.videosPerPageFormControl.setValue(this.count);

        this.router.navigate(['/youtube'], { queryParams: { count: this.count, country: this.countryCode, category: this.categoryId } });
      } else {
        this.defaultRoute();
      }
    });

  }

  public defaultRoute() {
    this.appContext.selectedCountry.subscribe((countryCode) => {
      this.countryCode = countryCode;
      const defaultCountry = this.countries.find((country) => country.code === countryCode).name;
      this.countryFormControl.setValue(defaultCountry);
    });
    this.appContext.selectedCategory.subscribe((categoryId) => {
      this.categoryId = categoryId;
    });

    this.appContext.videosCategoryList.subscribe((categories) => {
      if (categories.length) {
        // tslint:disable-next-line:triple-equals
        const defaultCategory = categories.find((category) => category.id == this.categoryId).name;
        this.categoryFormControl.setValue(defaultCategory);
      }
    });

    this.appContext.videosCountPerPage.subscribe((count) => {
      this.count = count;
      this.videosPerPageFormControl.setValue(count);
    });

    this.router.navigate(['/youtube'], { queryParams: { count: this.count, country: this.countryCode, category: this.categoryId } });
  }
}

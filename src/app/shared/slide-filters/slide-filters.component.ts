import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/internal/operators';

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
  public countryList: ICountryListModel[] = appConfig.countryList;

  public categoryFormControl: FormControl = new FormControl();
  public categoriesList: ICategoryListInterface[] = [
    {name: 'Film & Animation', id: 1},
    {name: 'Autos & Vehicles', id: 2},
    {name: 'Music', id: 10},
    {name: 'Pets & Animals', id: 4}
  ];

  public videosPerPageFormControl: FormControl = new FormControl();
  public defaultVideosOnPage: number = appConfig.maxVideosToLoad;
  public count: number;

  constructor(private appContext: ContextService , private router: Router) {
  }

  public ngOnInit() {
    this.setDefaults();
    this.videosPerPageFormControl.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged())
      .subscribe((count) => this.onChangeVideosPerPage(count));
  }

  public onChangeVideosPerPage(count: number) {
    this.count = count;
    this.router.navigate(['/youtube'], { queryParams: { count: this.count } });
  }

  private setDefaults() {
    const defaultCountry = this.countryList.find((country) =>
      country.code === appConfig.defaultRegion).name;
    const defaultCategory = this.categoriesList.find((country) =>
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

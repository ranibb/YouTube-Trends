import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

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
  public countryFormControl: FormControl = new FormControl();
  public countryList: ICountryListModel[] = appConfig.countryList;

  public categoryFormControl: FormControl = new FormControl();
  public categoriesList: ICategoryListInterface[] = [
    {name: 'Film & Animation', id: 1},
    {name: 'Autos & Vehicles', id: 2},
    {name: 'Music', id: 10},
    {name: 'Pets & Animals', id: 4}
  ];

  public defaultVideosOnPage: number = appConfig.maxVideosToLoad;

  constructor(private appContext: ContextService) {
  }

  public ngOnInit() {
    this.setDefaults();
  }

  public onChangeVideosPerPage(count: number) {
    this.appContext.videosCountPerPage.next(count);
  }

  private setDefaults() {
    const defaultCountry = this.countryList.find((country) =>
      country.code === appConfig.defaultRegion).name;
    const defaultCategory = this.categoriesList.find((country) =>
      country.id === appConfig.defaultCategoryId).name;

    this.countryFormControl.setValue(defaultCountry);
    this.categoryFormControl.setValue(defaultCategory);
  }
}

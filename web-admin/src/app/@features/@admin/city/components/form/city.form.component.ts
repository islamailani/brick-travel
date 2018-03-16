import { Component, Inject, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ObjectID } from 'bson';

import { FILE_UPLOADER } from '../../../../../@core/fileUpload/fileUpload.module';
import { FileItem } from '../../../../../@core/fileUpload/providers/file-item';
import { FileUploader } from '../../../../../@core/fileUpload/providers/file-uploader';
import { ICityBiz } from '../../../../../@core/store/bizModel/city.biz.model';
import { CityService } from '../../../../../@core/store/providers/city.service';
import { ToasterService } from 'angular2-toaster';
import { ICity } from '../../../../../@core/store/entity/city/city.model';

export enum EntityFormMode {
  create,
  edit
}

@Component({
  selector: 'bricktravel-city-form',
  templateUrl: 'city.form.component.html',
  styleUrls: ['./city.form.component.scss']
})
export class CityFormComponent {
  submitted: boolean = false;
  hasBaseDropZoneOver: boolean = false;
  private _newCity : ICityBiz;
  private _originalCity : ICityBiz;

  constructor(private _cityService: CityService,
    @Inject(FILE_UPLOADER) public uploader: FileUploader,private toasterService: ToasterService,
    private activeModal: NgbActiveModal) {
    this.uploader.clearQueue();
    this.uploader.setOptions({ allowedMimeType: ['image/png']});
  }

  @Input()
  mode: EntityFormMode = EntityFormMode.create;

  @Input()
  set originalCity(city :ICityBiz) {
    if (city.id == '') {
      city.id = new ObjectID().toHexString();
    }
    this._originalCity = city;
    this._newCity = Object.assign({},city);
  }
  get newCity() : ICityBiz {
    return this._newCity;
  }

  @Input()
  title: string = 'Create City';

  hasFile(): boolean {
    return this._newCity.thumbnail != '';
  }

  isSubmitDisAllowed(form): boolean {
    return this.submitted || !this.isChanged() || !form.valid || (this.uploader.queue.length == 0 && this._newCity.thumbnail == '');
  }

  isChanged() : boolean {
    return !(this._newCity.name == this._originalCity.name &&
            this._newCity.adressCode == this._originalCity.adressCode &&
            this._newCity.thumbnail == this._originalCity.thumbnail)
  }

  create() {
    this.submitted = true;
    if (this.mode == EntityFormMode.create) {
      this._cityService.addCity(this._newCity)
      .subscribe((city) => {
        this.activeModal.close()
      },
      (err) => {
          this.toasterService.pop('error', 'Args Title', 'Args Body');
          this.activeModal.close()
      });
    }
    else {
      this._cityService.updateCity(this._newCity)
      .subscribe((city) => {
        this.toasterService.pop('success', 'Args Title', 'Args Body');
        this.activeModal.close()
      },
        (err) => {
          this.toasterService.pop('error', 'Args Title', 'Args Body');
          this.activeModal.close()
        });;
    }
  }

  close() {
    this.activeModal.close();
  }

  fileOverBase(e: boolean): void {
      this.hasBaseDropZoneOver = e;
  }

  fileDropped(fileItems: FileItem[]): void {
    let reader = new FileReader();

    reader.onloadend = (e: any) => {
      this._newCity.thumbnail = e.target.result;
    }

    reader.readAsDataURL(fileItems[0]._file)
  }
}

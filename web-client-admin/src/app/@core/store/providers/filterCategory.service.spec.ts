import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { IonicStorageModule } from '@ionic/storage';
import { cold } from 'jasmine-marbles';
import { merge } from 'rxjs/operators';

import { FileUploadModule } from '../../fileUpload/fileUpload.module';
import { WEBAPI_HOST } from '../../utils/constants';
import { StoreModule } from '../store.module';
import { ErrorService } from './error.service';
import { FilterCategoryService } from './filterCategory.service';

const filterCategoryData = [
    {
        name: '类型',
        filterFunction: 'filterByCategory',
        criteries: [
            {
                name: '景点',
                criteria: '0',
                isChecked: false,
                id: '5a4b4d6030e1cf2b19b493da'
            },
            {
                name: '美食',
                criteria: '1',
                isChecked: false,
                id: '5a4b4d6030e1cf2b19b493d9'
            }
        ],
        id: '5a4b4d6030e1cf2b19b493d8'
    }
];

const updateData = {
    name: '类型1',
    filterFunction: 'filterByCategory',
    criteries: [
        {
            name: '景点',
            criteria: '0',
            isChecked: false,
            id: '5a4b4d6030e1cf2b19b493da'
        },
        {
            name: '美食',
            criteria: '1',
            isChecked: false,
            id: '5a4b4d6030e1cf2b19b493d9'
        }
    ],
    id: '5a4b4d6030e1cf2b19b493d8'
};

const errorData = {
    status: 404,
    statusText: 'Not Found'
};

let service: FilterCategoryService;
let errorService: ErrorService;
let httpTestingController: HttpTestingController;

describe('filterCategory test', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                IonicStorageModule.forRoot(),
                StoreModule.forRoot(),
                FileUploadModule.forRoot({ url: `${WEBAPI_HOST}/fileUpload` })
            ]
        });
        httpTestingController = TestBed.get(HttpTestingController);
        service = TestBed.get(FilterCategoryService);
        errorService = TestBed.get(ErrorService);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    describe('fetch test', () => {
        it('#fetch - Success', () => {
            const provided = service.filterCategories$.pipe(
                merge(errorService.error$)
            );
            const expected = cold('(ab)',
                {
                    a: filterCategoryData,
                    b: null
                });
            service.fetch();

            const req = httpTestingController.expectOne('http://localhost:3000/filterCategories');

            req.flush(filterCategoryData);

            expect(provided).toBeObservable(expected);
        });

        it('#fetch - Failed with backend error', () => {
            const provided = errorService.error$.pipe(
                merge(service.filterCategories$)
            );

            const expected = cold('(ba)',
                {
                    b: {
                        network: false,
                        description: 'error happened',
                        stack: ''
                    },
                    a: []
                });
            service.fetch();

            const req = httpTestingController.expectOne('http://localhost:3000/filterCategories');

            req.flush('error happened', errorData);

            expect(provided).toBeObservable(expected);
        });

        it('#fetch - Failed with network error', () => {
            const provided = errorService.error$.pipe(
                merge(service.filterCategories$)
            );

            const expected = cold('(ba)',
                {
                    b: {
                        network: true,
                        description: '',
                        stack: ''
                    },
                    a: []
                });

            service.fetch();

            const req = httpTestingController.expectOne('http://localhost:3000/filterCategories');

            req.error(new ErrorEvent('network error'));


            expect(provided).toBeObservable(expected);
        });

        it('#fetch - Success after Failed', () => {
            const provided = errorService.error$.pipe(
                merge(service.filterCategories$)
            );
            const expected = cold('(ab)',
                {
                    a: null,
                    b: filterCategoryData
                });

            service.fetch();

            let req = httpTestingController.expectOne('http://localhost:3000/filterCategories');

            req.error(new ErrorEvent('network error'));

            service.fetch();

            req = httpTestingController.expectOne('http://localhost:3000/filterCategories');

            req.flush(filterCategoryData);

            expect(provided).toBeObservable(expected);
        });
    });

    describe('add test', () => {
        it('#add - Success', () => {
            const provided = service.filterCategories$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: filterCategoryData,
                    b: null
                });

            service.add(filterCategoryData[0]);

            const req = httpTestingController.expectOne('http://localhost:3000/filterCategories');

            req.flush(filterCategoryData);

            expect(provided).toBeObservable(expected);
        });

        it('#add - Failed with backend error', () => {
            const provide = service.filterCategories$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: [],
                    b: {
                        network: false,
                        description: 'error happened',
                        stack: ''
                    }
                });

            service.add(filterCategoryData[0]);

            const req = httpTestingController.expectOne('http://localhost:3000/filterCategories');

            req.flush('error happened', errorData);

            expect(provide).toBeObservable(expected);
        });

        it('#add - Failed with network error', () => {
            const provide = service.filterCategories$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: [],
                    b: {
                        network: true,
                        description: '',
                        stack: ''
                    }
                });

            service.add(filterCategoryData[0]);

            const req = httpTestingController.expectOne('http://localhost:3000/filterCategories');

            req.error(new ErrorEvent('network error'));

            expect(provide).toBeObservable(expected);
        });

        it('#add - Success after Failed', () => {
            const provide = service.filterCategories$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: filterCategoryData,
                    b: null
                });

            service.add(filterCategoryData[0]);

            let req = httpTestingController.expectOne('http://localhost:3000/filterCategories');

            req.error(new ErrorEvent('network error'));

            service.add(filterCategoryData[0]);

            req = httpTestingController.expectOne('http://localhost:3000/filterCategories');

            req.flush(filterCategoryData);

            expect(provide).toBeObservable(expected);
        });
    });

    describe('update test', () => {
        beforeEach(() => {
            service.add(filterCategoryData[0]);
            const req = httpTestingController.expectOne('http://localhost:3000/filterCategories');

            req.flush(filterCategoryData);
        });

        it('#update - Success', () => {
            const provided = service.filterCategories$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: [updateData],
                    b: null
                });

            service.change(updateData);

            const req = httpTestingController.expectOne('http://localhost:3000/filterCategories');

            req.flush([updateData]);

            expect(provided).toBeObservable(expected);
        });

        it('#update - Failed with backend error', () => {
            const provide = service.filterCategories$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: filterCategoryData,
                    b: {
                        network: false,
                        description: 'error happened',
                        stack: ''
                    }
                });

            service.change(updateData);

            const req = httpTestingController.expectOne('http://localhost:3000/filterCategories');

            req.flush('error happened', errorData);

            expect(provide).toBeObservable(expected);
        });

        it('#update - Failed with network error', () => {
            const provide = service.filterCategories$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: filterCategoryData,
                    b: {
                        network: true,
                        description: '',
                        stack: ''
                    }
                });

            service.change(updateData);

            const req = httpTestingController.expectOne('http://localhost:3000/filterCategories');

            req.error(new ErrorEvent('network error'));

            expect(provide).toBeObservable(expected);
        });

        it('#update - Success after Failed', () => {
            const provide = service.filterCategories$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: [updateData],
                    b: null
                });

            service.change(updateData);

            let req = httpTestingController.expectOne('http://localhost:3000/filterCategories');

            req.error(new ErrorEvent('network error'));

            service.change(updateData);

            req = httpTestingController.expectOne('http://localhost:3000/filterCategories');

            req.flush([updateData]);

            expect(provide).toBeObservable(expected);
        });
    });

    describe('delete test', () => {
        beforeEach(() => {
            service.add(filterCategoryData[0]);
            const req = httpTestingController.expectOne('http://localhost:3000/filterCategories');

            req.flush(filterCategoryData);
        });

        it('#delete - Success', () => {
            const provided = service.filterCategories$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: [],
                    b: null
                });

            service.remove(updateData);

            const req = httpTestingController.expectOne(`http://localhost:3000/filterCategories/${updateData.id}`);

            req.flush([updateData]);

            expect(provided).toBeObservable(expected);
        });

        it('#delete - Failed with backend error', () => {
            const provide = service.filterCategories$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: filterCategoryData,
                    b: {
                        network: false,
                        description: 'error happened',
                        stack: ''
                    }
                });

            service.remove(updateData);

            const req = httpTestingController.expectOne(`http://localhost:3000/filterCategories/${updateData.id}`);

            req.flush('error happened', errorData);

            expect(provide).toBeObservable(expected);
        });

        it('#delete - Failed with network error', () => {
            const provide = service.filterCategories$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: filterCategoryData,
                    b: {
                        network: true,
                        description: '',
                        stack: ''
                    }
                });

            service.remove(updateData);

            const req = httpTestingController.expectOne(`http://localhost:3000/filterCategories/${updateData.id}`);

            req.error(new ErrorEvent('network error'));

            expect(provide).toBeObservable(expected);
        });

        it('#delete - Success after Failed', () => {
            const provide = service.filterCategories$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: [],
                    b: null
                });

            service.remove(updateData);

            let req = httpTestingController.expectOne(`http://localhost:3000/filterCategories/${updateData.id}`);

            req.error(new ErrorEvent('network error'));

            service.remove(updateData);

            req = httpTestingController.expectOne(`http://localhost:3000/filterCategories/${updateData.id}`);

            req.flush([updateData]);

            expect(provide).toBeObservable(expected);
        });
    });
});

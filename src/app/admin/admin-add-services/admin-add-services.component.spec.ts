import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddServicesComponent } from './admin-add-services.component';

describe('AdminAddServicesComponent', () => {
  let component: AdminAddServicesComponent;
  let fixture: ComponentFixture<AdminAddServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAddServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAddServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

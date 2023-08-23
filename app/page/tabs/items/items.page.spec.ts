import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ItemsPage } from './items.page';

describe('ItemPage', () => {
  let component: ItemsPage;
  let fixture: ComponentFixture<ItemsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ItemsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

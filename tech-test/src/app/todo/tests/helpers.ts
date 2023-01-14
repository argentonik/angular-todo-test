import { ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

export function findElement<T>(
  fixture: ComponentFixture<T>,
  testId: string
): DebugElement {
  return fixture.debugElement.query(By.css(`[data-testid="${testId}"]`));
}

export function findElements<T>(
  fixture: ComponentFixture<T>,
  testId: string
): DebugElement[] {
  return fixture.debugElement.queryAll(By.css(`[data-testid="${testId}"]`));
}

export function getElementTextContent<T>(
  fixture: ComponentFixture<T>,
  testId: string
): string {
  return findElement(fixture, testId)?.nativeElement?.textContent;
}

export function click<T>(fixture: ComponentFixture<T>, testId: string): void {
  const element = findElement(fixture, testId);
  element.triggerEventHandler('click', new MouseEvent('click'));
}

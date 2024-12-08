import type { CategoryListElement } from './types';

import test from 'ava';

import { CORRECT } from './correctResult';
import { getCategories } from './mockedApi';
import {
  categoryTree,
  determineCategoriesOnHomePage,
  extractOrder,
  shouldShowOnHomeScreen,
} from './solution';

// categoryTree

test('should return a properly structured and sorted category tree', async (t) => {
  const result = await categoryTree(getCategories);

  t.deepEqual(result, CORRECT);
});

test('should correctly handle empty category data', async (t) => {
  const emptyGetCategories = async (): ReturnType<typeof getCategories> => ({
    data: [],
  });

  const result = await categoryTree(emptyGetCategories);

  t.is(result.length, 0);
});

test('should return empty array for wrong data', async (t) => {
  const emptyGetCategories = async (): ReturnType<typeof getCategories> => ({
    data: undefined,
  });

  const result = await categoryTree(emptyGetCategories);

  t.is(result.length, 0);
});

// extractOrder

test('should return extracted order when title contains # and valid number', (t) => {
  t.is(extractOrder('2#', 1), 2);
});

test('should return extracted order when title does not contain # and has a valid number', (t) => {
  t.is(extractOrder('2', 9327), 2);
});

test('should return id when title contains # but no valid number', (t) => {
  t.is(extractOrder('Woski zapachowe#', 9804), 9804);
});

test('should return id when title does not contain # and has no valid number', (t) => {
  t.is(extractOrder('Saszetki', 9326), 9326);
});

test('should return id when title is empty', (t) => {
  t.is(extractOrder('', 9), 9);
});

// shouldShowOnHomeScreen

test('should return false for non-root elements', (t) => {
  t.is(shouldShowOnHomeScreen(false, 'Title#'), false);
});

test('should return true for root element and title with #', (t) => {
  t.is(shouldShowOnHomeScreen(true, 'Woski zapachowe#'), true);
});

test('should return false for root element and title without #', (t) => {
  t.is(shouldShowOnHomeScreen(true, 'Saszetki'), false);
});

test('should return false for root element and empty title', (t) => {
  t.is(shouldShowOnHomeScreen(true, ''), false);
});

// determineCategoriesOnHomePage

test('should return categories with showOnHome = true if less or equal 5', (t) => {
  const categories = Array(4)
    .fill({})
    .map(() => ({ showOnHome: false } as CategoryListElement));
  const result = determineCategoriesOnHomePage(categories);

  t.true(result.every((category) => category.showOnHome));
});

test('Marks the first 3 categories as showOnHome if exceeding 5 and none marked', (t) => {
  const categories = Array(10)
    .fill({})
    .map(() => ({ showOnHome: false } as CategoryListElement));
  const result = determineCategoriesOnHomePage(categories);

  t.is(result.filter((category) => category.showOnHome).length, 3);
});

test('should return not overwritten existing showOnHome settings', (t) => {
  const categories = Array(10)
    .fill({})
    .map(() => ({ showOnHome: false } as CategoryListElement));
  categories[2].showOnHome = true;
  const result = determineCategoriesOnHomePage(categories);

  t.true(result[2].showOnHome);
  t.is(result.filter((category) => category.showOnHome).length, 1);
});

test('should return an empty array unchanged if categories are empty', (t) => {
  const categories: CategoryListElement[] = [];
  const result = determineCategoriesOnHomePage(categories);

  t.deepEqual(result, []);
});

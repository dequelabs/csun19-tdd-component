# ARIA Tabs tdd

* Hello/introduction/explanation of what we'll do
* Talk briefly about what is already setup (and what is not yet written...)
* Open ARIA authoring practices for tabs and write test cases using it
* Run tests (+watcher) and show all todos
* Write first (failing) test and show axe violation
* Fix axe violation and continue writing the tests
* Once tests all written, start writing the module
* Show tests passing
* Open up demo (maybe create color contrast violation!?)
* Open up for questions


```js
test('throws on octopus', () => {
  expect(() => {
    drinkFlavor('octopus');
  }).toThrow();
});
```

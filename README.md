# Utah CS Dashboard

This is the repo for the [Utah CS Dashboard](https://chxhana.github.io/Utah-CS/).

## Tech Stack

This project is built with <b>React</b> in TypeScript. Besides React, some core libraries include:

- [D3](https://github.com/d3/d3) for some of the data visualizations, scales, axis
- [mobx](https://mobx.js.org/README.html) for state management
- [Material UI](https://mui.com/material-ui/getting-started/overview/) for UI framework.


## Getting Started

After cloning the project to local development environment, here are the commands to run the project:

### `yarn`

Install the packages required for the project. Normally, you only need to do this once.

### `yarn start`

Runs the app. Open [http://localhost:3000](http://localhost:3000) to view it in the browser. The page will reload if you make edits.

### `yarn deploy`

Build the project and deploy it to the Github Page.

## Change / Update Data

Currently, data is in `./public/updated_data`, and it is named `all_data.xlsx`. To update or change the data file:

1. Put the updated data in the same folder `./public/updated_data`
2. If the new data has a different name, go to `./src/Preset/Constants.ts`, update the variable `linkToData` accordingly.
3. Deploy project so that the data is on the github server link. (go to the link of `linkToData` to verify that the data is available)
4. IF new year is added, update the array in `./src/Preset/Constants.ts`, named `PossibleSchoolYears`, and add the new school year. For example, if the new data include 2022-2023 academic year:
```tsx
<!-- the original variable might look like this -->
export const PossibleSchoolYears = ['2019-20', '2020-21', '2021-22', '2022-23'];

<!-- Change it to -->
export const PossibleSchoolYears = ['2019-20', '2020-21', '2021-22', '2022-23', '2023-24'];
```
## Project Structure

### Data Loading and Retrieving

The data is loaded in `App.tsx`, and stored in a `DataContext`. All data is stored in an object:
``` ts
{
    state: stateData,
    school: schoolData,
    district: districtData,
    course: courseData,
    courseList: courseCategorization
}
```
All the values are array of arrays. To use data in a component:

```ts
//You will need to import useContext and DataContext
const toUseData = useContext(DataContext);
//If you want to use a particular data
const courseData = toUseData.course;
 ```
Because the `DataContext` created in `App.tsx` wrapped over the entire project in the `return` statement of `App`, it can be used in any component, and will update across all components.

### State Management

State are used so that updating one selection in a particular component can have effect over the entire project. The State object is in `./Interface/Store.ts`.

To use the state variable in a component,
```ts
// import useContext and Store
// make sure the Store is imported from ./Interface/Store
    const store = useContext(Store);
```
For example, if the current school year is needed for the component:
```ts
console.log(store.schoolYearShowing)
```
this line will print the current school year selected in the browser console.

If the state variable is directly used as part of the `return` of the component, for example:

```tsx
const Example:FC = ()=>{
    // an example component that output a div that just shows the current school year showing
    return (
        <div>
        {store.schoolYearShowing}
        </div>
    )
}
export default observer (Example)
```
If the component is in the `observer` (from MobX) in the export, the `store.schoolYearShowing` in the component will automatically update whenever `schoolYearShowing` changes. This will ONLY happen IF `observer` is used in the `export` statement.

### Interface Structure

Each part of the dashboard is divided into its own component. Starting from the top, `App.tsx` has the state table and the tabs, and each tab is its own component.

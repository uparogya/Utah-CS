# Utah CS Dashboard

This is the repo for Utah CS Dashboard.

## Tech Stack

This project is built with <b>React</b> in TypeScript. Besides React, some core libraries include:

- [D3](https://github.com/d3/d3) for some of the data visualizations, scales, axis
- [mobx](https://mobx.js.org/README.html) for state management
- [Material UI](https://mui.com/material-ui/getting-started/overview/) for UI framework.


## Getting Started

After cloning the project to local development environment, here are the commands to run the project:

### `yarn`

Install the packages required for the proejct. Normally, you only need to do this once.

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
export const PossibleSchoolYears = ['2019-20', '2020-21', '2021-22'];

<!-- Change it to -->
export const PossibleSchoolYears = ['2019-20', '2020-21', '2021-22', '2022-23'];
```
## Project Structure

### Data Loading and Retrieving

The data is loaded in `App.tsx`, and stored in a `DataContext`. All data is stored in an object:
```
{
    state: stateData,
    school: schoolData,
    district: districtData,
    course: courseData,
    courseList: courseCategorization
}
```

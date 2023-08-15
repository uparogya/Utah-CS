import { TableRow } from "@mui/material";
import { FC, useState } from "react";
import PercentageChart from "../CellComponents/PercentageChart";
import { TextCell } from "../GeneralComponents";
import { findAttribute } from "../../Interface/AttributeFinder";
import { observer } from "mobx-react-lite";
import GenderRatioChart from "../CellComponents/GenderRatioChart";
import AttributeChart from "../CellComponents/AttributeChart";
import AttributeDialog from "../CellComponents/AttributeDialog";
import { format } from "d3-format";

type Prop = {
    courseEntry: (number | string)[];
    titleEntry: string[];
};

const AllInfoRow: FC<Prop> = ({ courseEntry, titleEntry }: Prop) => {

    const [openAttributeDialog, setOpenAttributeDialog] = useState(false);

    const courseAttributeFinder = (attributeName: string) => findAttribute(attributeName, titleEntry, courseEntry);

    return (
        <TableRow key={`course-row-${courseAttributeFinder('Course Name')}`}>

            <TextCell style={{ maxWidth: '20vw' }}>
                {courseAttributeFinder('Course Name')}
            </TextCell>
            <TextCell >
                {isNaN(+courseAttributeFinder('Total')) ? courseAttributeFinder('Total') : format(',')(courseAttributeFinder('Total'))}
            </TextCell>
            <TextCell>
                <GenderRatioChart
                    femaleNum={courseAttributeFinder(`Female`)}
                    maleNum={courseAttributeFinder(`Male`)}
                    totalStudent={courseAttributeFinder('Total')}
                />
            </TextCell>
            <TextCell onClick={() => setOpenAttributeDialog(true)} >
                <AttributeChart option='race'
                    keyIdentity={String(courseAttributeFinder('Course Name'))}
                    outputObj={{
                        white: courseAttributeFinder('White'),
                        hispanic: courseAttributeFinder('Hispanic or Latino'),
                        asian: courseAttributeFinder('Asian'),
                        black: courseAttributeFinder('Black or African American'),
                        native: courseAttributeFinder("American Indian or Alaska Native"),
                        other: courseAttributeFinder('Two or more races'),
                        pacific: courseAttributeFinder('Native Hawaiian or Pacific Islander')
                    }} />
            </TextCell>
            <TextCell>
                <PercentageChart
                    actualVal={courseAttributeFinder(`Disability`)}
                    percentage={(+courseAttributeFinder(`Disability`)) / (+courseAttributeFinder('Total'))} />
            </TextCell>
            <TextCell>
                <PercentageChart
                    actualVal={courseAttributeFinder(`Eco. Dis.`)}
                    percentage={(+courseAttributeFinder(`Eco. Dis.`)) / (+courseAttributeFinder('Total'))} />
            </TextCell>
            <TextCell>
                <PercentageChart
                    actualVal={courseAttributeFinder(`Eng. Learners`)}
                    percentage={(+courseAttributeFinder(`Eng. Learners`)) / (+courseAttributeFinder('Total'))} />
            </TextCell>
            <AttributeDialog option='Race' openDialog={openAttributeDialog}
                setDialogVisibility={(bol: boolean) => setOpenAttributeDialog(bol)}
                CSAttributeOutput={{
                    white: courseAttributeFinder('White'),
                    hispanic: courseAttributeFinder('Hispanic or Latino'),
                    asian: courseAttributeFinder('Asian'),
                    black: courseAttributeFinder('Black or African American'),
                    native: courseAttributeFinder("American Indian or Alaska Native"),
                    other: courseAttributeFinder('Two or more races'),
                    pacific: courseAttributeFinder('Native Hawaiian or Pacific Islander')
                }} />
        </TableRow >
    );
};

export default observer(AllInfoRow);

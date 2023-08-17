
// const cards = [
//     { id: 1, title: 'Card 1', text: 'Line 1 text for card 1', subtitle: 'Line 2 text for card 1' },
//     { id: 2, title: 'Card 2', text: 'Line 1 text for card 2', subtitle: 'Line 2 text for card 2' },
//     { id: 3, title: 'Card 3', text: 'Line 1 text for card 3', subtitle: 'Line 2 text for card 3' },
//     { id: 4, title: 'Card 4', text: 'Line 1 text for card 4', subtitle: 'Line 2 text for card 4' }
// ];

import { Card, CardContent, Typography } from "@mui/material";
import { FC, ReactNode } from "react";

type Prop = {
    mainText: ReactNode;
    subText: ReactNode;
    height?: string;
};

const OverviewCard: FC<Prop> = ({ mainText, subText, height }: Prop) => {
    return (
        <Card variant="outlined" sx={{ minHeight: '100%', maxHeight: '100%', textAlign: 'center' }}>
            <CardContent>
                {/* <Typography variant="h5" component="h2">
                    {title}
                </Typography> */}

                <Typography color="#3d3d3d" variant="body2" component="p">
                    {subText}
                </Typography>
                <Typography variant="h3" component="h1">
                    {mainText}
                </Typography>
            </CardContent>
        </Card>
    );
};

// const App = () => {
//     return (
//         <Grid container spacing={2}>
//             {cards.map((card) => (
//                 <Grid key={card.id} item xs={12} sm={6} md={3}>
//                     <CardComponent card={card} />
//                 </Grid>
//             ))}
//         </Grid>
//     );
// };

export default OverviewCard








import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';

interface ChipData {
  key: number;
  label: string;
}

const useStyles = makeStyles((theme : Theme) => createStyles({
    root: {
        maxWidth: 345
    },
    pokemonId: {
        margin: '12px'
    },
    paper: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      listStyle: 'none',
      padding: theme.spacing(0.5),
      margin: 0,
    },
    chip: {
      margin: theme.spacing(0.5),
    }
}));

export const PokemonCard = () : JSX.Element => {
    const classes = useStyles();

    const [chipData, setChipData] = React.useState<ChipData[]>([
      { key: 0, label: 'Angular' },
      { key: 1, label: 'jQuery' },
      { key: 2, label: 'Polymer' },
      { key: 3, label: 'React' },
      { key: 4, label: 'Vue.js' },
    ]);

    return (
        <Card className={classes.root}>
            <CardActionArea>
                <Typography className={classes.pokemonId} variant="h5" component="h1">
                    #1
                </Typography>
                <CardMedia
                    component="img"
                    alt="Contemplative Reptile"
                    width="140"
                    height="320"
                    image="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
                    title="Contemplative Reptile"/>
                <CardContent>
                    <Typography gutterBottom variant="h4" component="h2">
                        Bulbasaur
                    </Typography>

                </CardContent>
            </CardActionArea>
            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                    <FavoriteIcon/>
                </IconButton>
                <Paper component="ul" className={classes.paper}>
                    {chipData.map((data) => {
                        return (
                            <li key={data.key}>
                                <Chip
                                    label={data.label}
                                    className={classes.chip}/>
                            </li>
                        );
                    })}
                </Paper>
            </CardActions>
        </Card>
    );
}

export default PokemonCard;

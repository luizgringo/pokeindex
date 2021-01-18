import React, { useEffect, useState, useCallback } from 'react';
import clsx from 'clsx';
import {makeStyles, useTheme, Theme, createStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import PokemonApi from '../../api/PokemonApi';
import { PokemonTypes } from '../../models/PokemonTypes';

import _ from 'lodash';

const drawerWidth = 240;

const useStyles = makeStyles((theme : Theme) => createStyles({
    root: {
        display: 'flex'
    },
    appBar: {
        transition: theme
            .transitions
            .create([
                'margin', 'width'
            ], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen
            })
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme
            .transitions
            .create([
                'margin', 'width'
            ], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen
            })
    },
    menuButton: {
        marginRight: theme.spacing(2)
    },
    hide: {
        display: 'none'
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0
    },
    drawerPaper: {
        width: drawerWidth
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end'
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme
            .transitions
            .create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen
            }),
        marginLeft: -drawerWidth
    },
    contentShift: {
        transition: theme
            .transitions
            .create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen
            }),
        marginLeft: 0
    },
    title: {
        flexGrow: 1,
        textAlign: 'center'
    },
    logoImage: {
        width: '200px',
        margin: '12px'
    },
    pokeball: {
        width: '80px',
        marginRight: '10px'
    },
    titleLeftMenu: {
        textAlign: 'center',
        fontSize: '22px',
        fontWeight: 'bold',
        marginTop: '15px',
        marginLeft: '15px'
    }
}),);

export default function PersistentDrawerLeft() {
    const [open, setOpen] = useState(false);
    const [mount, setMount] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pokemonTypes, setPokemonTypes] = useState<PokemonTypes>();

    const classes = useStyles();
    const theme = useTheme();

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const fetchData = useCallback(async () => {
        const api = new PokemonApi();
        const result: PokemonTypes = await api.getPokemonTypes();
        setPokemonTypes(result);
      }, []);

      useEffect(() => {
        if(!mount) {
          setMount(true);
          setLoading(true);
          fetchData();
        }
      },[fetchData, loading, mount]);

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                [classes.appBarShift]: open
            })}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, open && classes.hide)}>
                        <MenuIcon/>
                    </IconButton>
                    <Typography className={classes.title} variant="h6" noWrap>
                        <img
                            className={classes.logoImage}
                            src={process.env.PUBLIC_URL + '/images/pokemon-logo.png'}
                            alt="Pokémon Logo"/>
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                paper: classes.drawerPaper
            }}>
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr'
                            ? <ChevronLeftIcon/>
                            : <ChevronRightIcon/>}
                    </IconButton>
                </div>
                <Divider/>
                <div className={classes.titleLeftMenu}>
                    <div className="pokeballIMage">
                        <img
                            className={classes.pokeball}
                            src={process.env.PUBLIC_URL + '/images/pokeball.svg'}
                            alt="Pokeball"/>
                    </div>
                    <div className="titleText">Pokemon Types</div>
                </div>
                <List>
                    {pokemonTypes !== undefined ? pokemonTypes.results.map((type, index) => (
                        <ListItem button key={_.startCase(type.name)}>
                            <ListItemText primary={_.startCase(type.name)}/>
                        </ListItem>
                    )) : ''}
                </List>
            </Drawer>
            <main
                className={clsx(classes.content, {
                [classes.contentShift]: open
            })}/>
        </div>
    );
}

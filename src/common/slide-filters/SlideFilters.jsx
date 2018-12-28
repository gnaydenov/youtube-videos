/* eslint-disable linebreak-style */
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';

import './SlideFilters.scss';
import {appConfig} from '../../config';
import Axios from 'axios/index';
import {YoutubeService} from '../../services/youtube/Youtube';
import {hydrateStateWithLocalStorage, saveStateToLocalStorage} from '../../services/utils.js';


const countryList = appConfig.countryList;
const Handle = Slider.Handle;

const handle = (props) => {
    const {value, dragging, index, ...restProps} = props;
    return (
        <Tooltip
            prefixCls="rc-slider-tooltip"
            overlay={value}
            visible={dragging}
            placement="top"
            key={index}
        >
            <Handle value={value} {...restProps} />
        </Tooltip>
    );
};

handle.propTypes = {
    value: PropTypes.number,
    dragging: PropTypes.func,
    index: PropTypes.number
};

function renderInput(inputProps) {
    const {InputProps, ref, ...other} = inputProps;
    return (
        <TextField
            InputProps={{
                inputRef: ref,
                ...InputProps
            }}
            {...other}
        />
    );
}

function renderSuggestion({suggestion, index, itemProps, highlightedIndex, selectedItem}) {
    const isHighlighted = highlightedIndex === index;
    const isSelected = (selectedItem.name || '').indexOf(suggestion.name) > -1;

    return (
        <MenuItem
            {...itemProps}
            key={suggestion.id || suggestion.code}
            selected={isHighlighted}
            component="div"
            style={{
                fontWeight: isSelected ? 500 : 400
            }}
        >
            {suggestion.name}
        </MenuItem>
    );
}

renderSuggestion.propTypes = {
    highlightedIndex: PropTypes.number,
    index: PropTypes.number,
    itemProps: PropTypes.object,
    selectedItem: PropTypes.string,
    suggestion: PropTypes.shape({name: PropTypes.string}).isRequired
};

const service = new YoutubeService();

class SlideFilters extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categoriesList: [],
            selectionCategory: '',
            selectionCountry: '',
            itemsPerPage: this.props.config.maxVideosToLoad
        };
    }

    componentDidMount() {
        this.fetchCategories();
        this.setState(hydrateStateWithLocalStorage(this.state));
    }

    componentWillUnmount() {
        localStorage.setItem('itemsPerPage', JSON.stringify(this.props.config.maxVideosToLoad));
        saveStateToLocalStorage(this.state);
    }

    componentDidUpdate() {
        saveStateToLocalStorage(this.state);
    }

    async fetchCategories() {
        Axios.all(await service.getVideoCategories())
            .then((data) => {
                this.setState({
                    categoriesList: data,
                    isError: false
                });
            })
            .catch((err) => {
                this.setState({isError: true});
            });
    }

    onCategoryChange = (selection) => {
        this.setState({selectionCategory: selection});
        this.props.config.defaultCategoryId = selection.id;
        this.props.onChanges();
    }

    onCountryChange = (selection) => {
        this.setState({selectionCountry: selection});
        this.props.config.defaultRegion = selection.code;
        this.props.onChanges();
    }

    render() {
        const videosToLoadChange = (val) => {
            this.props.config.maxVideosToLoad = val;
            this.props.onChanges();
        };

        return (
            <div className="slide-filters-container">
                <h3 className="title">
                    Filters
                    <Button onClick={this.props.toggleDrawer} className="mat-icon-button">
                        <CloseIcon aria-label="Close"/>
                    </Button>
                </h3>
                <Downshift id="countrySelect" onChange={val => this.onCountryChange(val)}
                           itemToString={item => (item ? item.name : '')}
                           selectedItem={this.state.selectionCountry}>
                    {({
                          getInputProps,
                          getItemProps,
                          getMenuProps,
                          inputValue,
                          highlightedIndex,
                          isOpen,
                          selectedItem
                      }) => (
                        <div>
                            {renderInput({
                                fullWidth: true,
                                InputProps: getInputProps(),
                                label: 'Select Country'
                            })}
                            <div {...getMenuProps()}>
                                {isOpen ? (
                                    <Paper square>
                                        {countryList.filter(suggestion => !inputValue || suggestion.name.toLowerCase().includes(inputValue)).map((suggestion, index) =>
                                            renderSuggestion({
                                                suggestion,
                                                index,
                                                itemProps: getItemProps({item: suggestion}),
                                                highlightedIndex,
                                                selectedItem
                                            })
                                        )}
                                    </Paper>
                                ) : null}
                            </div>
                        </div>
                    )}
                </Downshift>
                <div className="divider"/>
                <Downshift
                    id="categorySelect" onChange={val => this.onCategoryChange(val)}
                    itemToString={item => (item ? item.name : '')}
                    selectedItem={this.state.selectionCategory}>
                    {({
                          getInputProps,
                          getItemProps,
                          getMenuProps,
                          highlightedIndex,
                          isOpen,
                          inputValue,
                          initialInputValue,
                          selectedItem
                      }) => (
                        <div>
                            {renderInput({
                                fullWidth: true,
                                InputProps: getInputProps(),
                                label: 'Select Category',

                            })}
                            <div {...getMenuProps()}>
                                {isOpen ? (
                                    <Paper square>
                                        {this.state.categoriesList.filter(suggestion => !inputValue || suggestion.name.toLowerCase().includes(inputValue)).map((suggestion, index) =>
                                            renderSuggestion({
                                                suggestion,
                                                index,
                                                itemProps: getItemProps({item: suggestion}),
                                                highlightedIndex,
                                                selectedItem
                                            })
                                        )}
                                    </Paper>
                                ) : null}
                            </div>
                        </div>
                    )}
                </Downshift>
                <div className="divider"/>
                <div className="videosCountPerPage">
                    <div className="caption">Count of videos on the page</div>
                    <div className="slider">
                        <Slider
                            min={1}
                            max={200}
                            value={this.state.itemsPerPage}
                            handle={handle}
                            onChange={val => this.setState({itemsPerPage: val})}
                            onAfterChange={videosToLoadChange}/>
                    </div>
                </div>
            </div>
        );
    }
}

SlideFilters.propTypes = {
    config: PropTypes.object,
    onChanges: PropTypes.func,
    toggleDrawer: PropTypes.func
};

export default SlideFilters;

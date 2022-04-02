import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import Timeline, { DateHeader, TimelineHeaders } from 'react-calendar-timeline';
import './Calendar.css';
import styles from './Calendar.module.css';
import left from '../../resources/left.svg';
import right from '../../resources/right.svg';
import {
  setPrevMonth,
  setNextMonth,
  selectVisibleTime,
  selectGroups,
  selectItems,
  fillCalendarGroups,
  fillCalendarItems,
  saveNewTimeOffRecord,
} from './calendarSlice';
import AddNewTimeOff from '../../features/calendar/addNewTimeOff/AddNewTimeOff';

import DropDownMenu from './DropDownMenu';

export default function Calendar() {
  const dispatch = useAppDispatch();

  const visibleTime = useAppSelector(selectVisibleTime);

  const { visibleTimeStart: defaultTimeStart, visibleTimeEnd: defaultTimeEnd }: any = visibleTime;

  const keys = {
    groupIdKey: 'id',
    groupTitleKey: 'userName',
    groupRightTitleKey: 'rightTitle',
    itemIdKey: 'id',
    itemTitleKey: 'shortTypeName',
    itemDivTitleKey: 'fullTypeName',
    itemGroupKey: 'userId',
    itemTimeStartKey: 'startDate',
    itemTimeEndKey: 'endDate',
    groupLabelKey: 'title',
  };

  let calendarGroups = useAppSelector(selectGroups);
  let calendarItems = useAppSelector(selectItems);

  useEffect(() => {
    dispatch(fillCalendarGroups());
    dispatch(fillCalendarItems());
  }, [dispatch]);

  const [itemSelected, setItemSelected] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const stopPropagation = function (e: any) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  const handleClick = (item: any) => (e: any) => {
    stopPropagation(e);
    setItemSelected(item);
    setAnchorEl(e.currentTarget);
  };

  const handleClose = (e: any) => {
    stopPropagation(e);
    setAnchorEl(null);
    setItemSelected(null);
  };

  const itemRenderer = ({ item, getItemProps }: any) => {
    return (
      <React.Fragment>
        <div {...getItemProps({})}>
          <div
            id={item.id}
            title={item.fullTypeName}
            onClick={handleClick(item)}
            style={{ backgroundColor: '#' + item.color }}
          >
            {item.shortTypeName}
          </div>
        </div>
      </React.Fragment>
    );
  };

  const handleTimeChange = (
    visibleTimeStart: any,
    visibleTimeEnd: any,
    updateScrollCanvas: any,
  ) => {
    updateScrollCanvas(visibleTimeStart, visibleTimeEnd);
  };

  return (
    <>
      <div className={styles.calendar__outer}>
        <div className={styles.label}>
          <div className={styles.label__title}>Calendar</div>
        </div>
        <div className={styles.buttons}>
          <button className={styles.buttons__previous} onClick={() => dispatch(setPrevMonth())}>
            <img className={styles.buttons__previousIcon} src={left} alt="left arrow" />
            <span className={styles.buttons__previousText}>Previous</span>
          </button>
          <button className={styles.buttons__next} onClick={() => dispatch(setNextMonth())}>
            <span className={styles.buttons__nextText}>Next</span>
            <img className={styles.buttons__nextIcon} src={right} alt="right arrow" />
          </button>
        </div>
        <Timeline
          groups={calendarGroups}
          items={calendarItems}
          keys={keys}
          visibleTimeStart={defaultTimeStart}
          visibleTimeEnd={defaultTimeEnd}
          timeSteps={{ second: 0, minute: 0, hour: 0, day: 1, month: 0, year: 0 }}
          itemRenderer={itemRenderer}
          minZoom={60 * 60 * 1000 * 24 * 31}
          maxZoom={60 * 60 * 1000 * 24 * 31}
          canMove={false}
          canResize={false}
          traditionalZoom={false}
          onTimeChange={handleTimeChange}
        >
          <TimelineHeaders>
            <DateHeader unit="month" labelFormat="MMMM" />
            <DateHeader unit="day" labelFormat="DD" />
            <DateHeader unit="day" labelFormat="ddd" />
          </TimelineHeaders>
        </Timeline>
      </div>
      <AddNewTimeOff
        actionCreator={saveNewTimeOffRecord}
        title="Add new time off"
        confirmText="Save"
      />
      {itemSelected !== null && (
        <DropDownMenu
          setAnchorEl={setAnchorEl}
          anchorEl={anchorEl}
          onClose={handleClose}
          itemSelected={itemSelected}
          setItemSelected={setItemSelected}
        />
      )}
    </>
  );
}

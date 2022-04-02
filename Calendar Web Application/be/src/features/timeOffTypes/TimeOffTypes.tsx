import React, { useState } from 'react';
import ArrowDropUp from '@mui/icons-material/ArrowDropUp';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';

import TimeOffTypeTable from './timeOffTypesTable/TimeOffTypesTable';
import './TimeOffTypes.css';
import { useAppDispatch } from '../../app/hooks';
import { setIsAddNewType } from './timeOffTypesSlice';
import StyledAddButton from '../../components/styledAddButton/StyledAddButton';

export default function TimeOffTypes() {
  //Used to check if Accordion is expanded
  const [expanded, setExpanded] = useState<boolean>(false);
  const appDispatch = useAppDispatch();
  const handleIconChange = (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  //When "Add a type" button is clicked addTypeForm component is added to a table
  const handleAddNewTypeForm = (
    event: React.MouseEvent | React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    if (expanded) {
      event.stopPropagation();
    }
    appDispatch(setIsAddNewType(true));
  };

  const renderAccordionArrow = (isExpanded: boolean) => {
    return !isExpanded ? (
      <ArrowDropDown
        sx={{
          fill: '#404CFA',
        }}
      />
    ) : (
      <ArrowDropUp
        sx={{
          fill: '#404CFA',
        }}
      />
    );
  };

  return (
    <Accordion
      onChange={handleIconChange}
      sx={{
        boxShadow: 0,
        border: 'solid 1px #21212120',
      }}
    >
      <AccordionSummary sx={{ maxHeight: '40px' }}>
        <div className="accordion_summary">
          <div className="accordion_summary__text-container">
            <Typography
              sx={{
                fontFamily: 'Poppins',
                fontSize: 16,
                lineHeight: '26px',
                fontWeight: 500,
                color: '#000000',
              }}
            >
              Time Off Types
            </Typography>
            {renderAccordionArrow(expanded)}
          </div>
          <StyledAddButton
            className="accordion_summary__add-new-type-btn"
            onClick={handleAddNewTypeForm}
            sx={{
              width: 138,
              height: 36,
            }}
          >
            Add a type
          </StyledAddButton>
        </div>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: 0 }}>
        <TimeOffTypeTable />
      </AccordionDetails>
    </Accordion>
  );
}

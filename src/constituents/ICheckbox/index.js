import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import Image from '../../property/images/checkbox_mark.png'; // Import using relative path


import colors from '../../themes/colors';

const useStyles = makeStyles({
  root: {
    padding: 0,
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  icon: {
    borderRadius: 5,
    width: 25,
    height: 25,
    border: '1.5px solid #D9D9D9',
    backgroundColor: '#fff',
    backgroundImage: 'initial',
    '$root.Mui-focusVisible &': {
      outline: '2px auto rgba(19,124,189,.6)',
      outlineOffset: 2,
    },
    'input:hover ~ &': {
      // backgroundColor: colors.checkbox.icon.hover.background_color,
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: colors.checkbox.icon.disabled.background,
    },
  },
  checkedIcon: {
    backgroundColor: "#fff",
    borderColor: '#00A5D9',
    '&:before': {
      display: 'block',
      width: 25,
      height: 25,
      backgroundImage: `url(${Image})`,
      backgroundRepeat: 'no-repeat',
      backgroundPositionX: 'center',
      backgroundPositionY: '6px',
      backgroundSize: '12px 10px',
      content: '""',
    },
    'input:hover ~ &': {
      backgroundColor: 'transparent',
    },
  },
});

const StyledCheckbox = (props) => {
  const classes = useStyles();
  const [checked, setChecked] = React.useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  return (
    <Checkbox
      checked={checked}
      onChange={handleChange}
      className={classes.root}
      disableRipple
      color="default"
      checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
      icon={<span className={classes.icon} />}
      inputProps={{ 'aria-label': 'decorative checkbox' }}
      {...props}
    />
  );
}


export default StyledCheckbox;
import React from 'react'
import PropTypes from 'prop-types'
import styles from './Task.css'
import formattedDate from './../util/formattedDate'

const Task = ({ id, title, description, priority, deadline, completionDate}) => (
  <div className={`${styles.task} ${completionDate ? styles.completed : ''}`}>
    <div className={styles.meta}>

      <span className={styles.title}>{title}</span>

      {deadline && (<span className={styles.deadline}>Deadline:&nbsp;{formattedDate(deadline)}</span>)}
      {completionDate && (<span className={styles.completionDate}>Completed:&nbsp;{formattedDate(completionDate)}</span>)}
      <span className={styles.completionDate}>id:&nbsp;{id}</span>
      <span className={styles.completionDate}>priority:&nbsp;{priority}</span>

      {!completionDate && (<span className={styles.priority}>
        <a className={(priority === 2) ? styles.veryImportant : ''}>Very&nbsp;important</a>
        <a className={(priority === 1) ? styles.important : ''}>Important</a>
        <a className={(priority === 0) ? styles.ordinary : ''}>Ordinary</a>
      </span>)}

    </div>
    <div className={styles.description}>
    {description && 
      description.split('\n').map((line, i) => (<p key={i}>{line}</p>))}
    </div>
  </div>
)

Task.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  priority: PropTypes.number.isRequired,
  deadline: PropTypes.string,
  completionDate: PropTypes.string,
}

export default Task
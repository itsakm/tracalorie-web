import '@fortawesome/fontawesome-free/js/all'
import { Modal, Collapse } from 'bootstrap'

import CalorieTracker from './Tracker';
import { Meal, Workout } from './Item';

import './css/bootstrap.css'
import './css/style.css'


class App{
    constructor()
    {
        this._tracker = new CalorieTracker();
        this._loadEventListener();
        this._tracker.loadItems();
    }

    _loadEventListener()
    {
        document.querySelector('#meal-form').addEventListener('submit',this._newMeal.bind(this))
        document.querySelector('#workout-form').addEventListener('submit',this._newWorkout.bind(this))
        document.querySelector('#workout-items').addEventListener('click',this._removeItem.bind(this,'workout'))
        document.querySelector('#meal-items').addEventListener('click',this._removeItem.bind(this,'meal'))
        document.querySelector('#filter-meals').addEventListener('keyup',this._filterItems.bind(this,'meal'))
        document.querySelector('#filter-workouts').addEventListener('keyup',this._filterItems.bind(this,'workout'))
        document.querySelector('#reset').addEventListener('click',this._reset.bind(this));
        document.querySelector('#limit-form').addEventListener('submit',this._setLimit.bind(this));
    }

    _newMeal(e)
    {
        e.preventDefault();
        
        const name = document.querySelector('#meal-name');
        const calories = document.querySelector('#meal-calories');

        //Validate inputs
        if(name.value === '' || calories.value === '')
        {
            alert('Please fill all the fields');
            return;
        }

        const meal = new Meal(name.value,+calories.value);
        this._tracker.addMeal(meal);
        name.value = '';
        calories.value = '';

        const collapseMeal = document.querySelector('#collapse-meal');
        const bsCollapse = new Collapse(collapseMeal,{
            toggle:true
        });

    }


    _newWorkout(e)
    {
        e.preventDefault();
        
        const name = document.querySelector('#workout-name');
        const calories = document.querySelector('#workout-calories');

        //Validate inputs
        if(name.value === '' || calories.value === '')
        {
            alert('Please fill all the fields');
            return;
        }

        const workout = new Workout(name.value,+calories.value);
        this._tracker.addWorkout(workout);
        name.value = '';
        calories.value = '';

        const collapseWorkout = document.querySelector('#collapse-workout');
        const bsCollapse = new Collapse(collapseWorkout,{
            toggle:true
        });

    }

    _removeItem(type,e)
    {
        if(e.target.classList.contains('delete') || e.target.classList.contains('fa-xmark'))
        {
            if(confirm('Are you sure?'))
            {
                const id = e.target.closest('.card').getAttribute('data-id');

                type === 'meal'
                ? this._tracker.removeMeal(id)
                : this._tracker.removeWorkout(id)

                e.target.closest('.card').remove();
            }
        }
    }

    _filterItems(type,e)
    {
        const text = e.target.value.toLowerCase();
        document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
            const name = item.firstElementChild.firstElementChild.textContent;
            if(name.toLowerCase().indexOf(text) !== -1)
            {
                item.style.display = 'block';
            }
            else{
                item.style.display = 'none';
            }
        });
    }

    _reset()
    {
        this._tracker.reset();
        document.querySelector('#meal-items').innerHTML = '';
        document.querySelector('#workout-items').innerHTML = '';
        document.querySelector('#filter-meals').value = '';
        document.querySelector('#filter-workouts').value = '';

    }

    _setLimit(e)
    {
        e.preventDefault();
        const limit = document.querySelector('#limit');
        if(limit.value === '')
        {
            alert('Please add a limit');
            return;
        }

        this._tracker.setLimit(+limit.value);
        limit.value = '';

        const modalEl = document.querySelector('#limit-modal');
        const modal = Modal.getInstance(modalEl);
        modal.hide();
    }
}

const app = new App();

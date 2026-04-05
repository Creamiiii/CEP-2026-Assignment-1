# CEP 2026 Assignment 1
This project is a very simple program that aims to simulate the relationships between predator, prey, and producer, as well as showcase the Theory of Evolution by Natural Selection.

## Brief Overview
There exists three types of objects: predator, prey, and producer. Each predator and prey are initialised with some default values for their speed, agility, perception, and size stats. The prey (herbivore), must find and eat the producers (food), in order to survive. The predator (carnivore), must find prey and eat them, in order to survive as well. When reproducing, the offspring will have a certain chance of having each stat mutated (can increase or decrease). More information can be found on this page: https://tinkercademy.notion.site/Assignment-1-Write-up-2131ef746aec82d6abdb81fb022fb088

## Algorithmic efficiency
To improve algorithmic efficiency, I implemented a Quadtree, such that each object does not have to scan global arrays, instead, only those close by. We can also switch to scanning global arrays, which drastically decreases performance -> Check below for more

## Controls

### M
#### Toggle statistics view

### N
#### Toggle between different optimisation modes
#### Quadtree: Most efficient, scan only those near each object
#### Global1: Scan all relevant global arrays (e.g. predators only scan prey array)
#### Global2: Scan all global arrays regardless of relevance (least efficient)

### S
#### Export data from start of program to current (in csv)
#### IMPORTANT: REQUIRES sheetJS AS A DEPENDENCY (check below)

### Left-click
#### When in Quadtree mode, toggles a view of Quadtree (significantly decreases performance)

## Dependencies

### Requires sheetJS
#### For node.js (verified to work)
In root directory, open terminal and enter `npm install xlsx`
#### For Yarn
In root directory, open terminal and enter `yarn add xlsx`

### Requires local server
#### For python server (verified to work)
Verify that python is installed: In a new command prompt (cmd or Powershell), enter `Python --version` or `py --version`. If python is installed, should display current version of python installed. If not installed, visit https://www.python.org/ to install python. After installation, in root directory, enter `py -m http.server` to create server on port 8000. If port 8000 is unavailable, enter `py -m http.server [xxxx]` where xxxx is a new port number. The web server should be now accessible on http://localhost:8000/ or the port you created the server on. 
#### Other methods such as vite would work, but has not been tested.


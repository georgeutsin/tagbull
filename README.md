# tagbull
The goal of this project is to experiment if it's possible to replicate one highly skilled dataset labeller by using several, less skilled labellers. As a result, the idea is that you can generate high quality labels at a fraction of the cost.

## Motivations
To achieve quality labels, this project focuses on a few things:
 - A) creating user friendly interfaces for label input (which happens to align well with being mobile first)
 - B) determining what kinds of sub-tasks are necessary to generate one complete label
 - C) finding algorithms to compare and merge visual labels
 
### A) Friendly interfaces
The idea behind this is that a happy labeller produces better results. Tons of crappy interfaces exist for making labels, so this project tries to improve on those by applying research and experimenting with what works.

The interfaces are built fromm the ground up, with an emphasis on usability from a mobile device. The idea is that going forward, the most natural way to create labels is using a touchscreen, and as the interfaces should reflect that.

### B) Breaking apart complex problems
Creating a label is a nuanced process that encapsulate a lot of definitions. This is why skilled human labellers are good at this; they can understand complex rules given by the person paying them. The effort here is to bake training into the activity of creating the label itself by breaking down a complex process into a series of simple steps, with checks and balances at every point along the way.

### C) Visual algorithms
Comparing two visual labels is a non trivial process. This project attempts to find statistical ways to compare two labels without knowing about the underlying ground truth. The idea is that the chance of two people landing on the same "solution" is so small that if it happens, it must be correct.
Merging labels is a necessary step to create a "super label" from multiple labels created by people (called samples in this project).

## Architecture/Definitions

### Definitions
 - Sample: a label that a human makes. Is considered untrustworthy on its own.
 - Tag: a label that the merging algorithm makes. Is considered trustworthy because it a combination of multiple opinions.
 - Task: a high level container designed to describe what needs to be done. Can be composed of other tasks.
 - Activity: the representation of a concrete task. An example would be the bounding box activity, which makes the user tap on an object to create a bounding box label.
 - Actor: a user that creates labels
 - User: a dataset owner
 - Portal: the web interface the dataset owner uses
 - Generator: the background job that creates a tag from multiple samples
 
 ### Architecture
 
React frontend, Rails backend, MySQL database. Automatically deployed on Heroku and Netlify. Read the code lol
 


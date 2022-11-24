Utilisation du available time slot

Un objet de la classe AvailableTimeSlot va permettre degerer des intervales de temps libres (des temps ou l'on peut placer des choses)

Pour instancier un tel objet il faut 
    - Une Period, un objet qui a deux champs start : Date en end : Date 
    - Un ensemble d'evenements de la forme GCalEvent[]
    - Une borne inf (l'heure à laquelle commence la journée)
    - Une borne sup (l'heure à laquelle finit la journée)

Attention à ce que toutes les heures soient dans le même fuseau horaire. 
Attention, pour les evenements recurrents, il faut TOUS les placer dans la liste d'events. 

Pour ajouter un evenement à un AvailableTimeSlot, il faut appeler la méthode removeEvent(event) de cet objet. 

Pour obtenir la liste de la forme Period[], il faut appeler la méthode getListTimeSlots().
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-refresh',
  templateUrl: './refresh.component.html',
  styleUrls: ['./refresh.component.scss']
})
export class RefreshComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onRefresh(){
    let refreshButton = document.getElementById('refresh');
    refreshButton.className =  "fa-solid fa-sync fa-spin";
    let texte = document.getElementById('refreshText');
    texte.innerHTML = "Chargement des donneés en cours ...";
    setTimeout(() => refreshButton.className = "fa fa-refresh", 2000);
    setTimeout(() =>texte.innerText = "Recharger les données", 2000);
  }

}

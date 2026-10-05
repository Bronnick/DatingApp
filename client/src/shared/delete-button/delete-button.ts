import { Component, input, output } from '@angular/core';
import { Photo } from '../../types/photo';

@Component({
  imports: [],
  selector: 'app-delete-button',
  styleUrl: './delete-button.css',
  templateUrl: './delete-button.html',
})
export class DeleteButton {
  onClick = input.required<() => void>()
  photo = input.required<Photo>()
  isMainPhoto = input<boolean>(false)
  
}

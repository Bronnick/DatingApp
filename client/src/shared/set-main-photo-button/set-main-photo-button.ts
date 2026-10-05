import { Component, input, output } from '@angular/core';
import { Photo } from '../../types/photo';

@Component({
  imports: [],
  selector: 'app-set-main-photo-button',
  styleUrl: './set-main-photo-button.css',
  templateUrl: './set-main-photo-button.html',
})
export class SetMainPhotoButton {
  photo = input.required<Photo>()
  isMainPhoto = input<boolean>(false)
  setMain = output<Photo>()

  onSetMainPhoto() {
    this.setMain.emit(this.photo())
  }
}

import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {
  CameraResultType, CameraSource, Capacitor, Plugins
} from '@capacitor/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  @ViewChild('filePicker', { static: false }) filePicker: ElementRef<HTMLInputElement>;
  @Output() imagePicker = new EventEmitter<string | File>();
  @Input() showPreview = false;
  public selectedImage: string;
  public usePicker = false;

  constructor(private readonly platform: Platform) { }

  ngOnInit(): void {
    console.log('Mobile:', this.platform.is('mobile'));
    console.log('Hybrid:', this.platform.is('hybrid'));
    console.log('iOS:', this.platform.is('ios'));
    console.log('Android:', this.platform.is('android'));
    console.log('Desktop:', this.platform.is('desktop'));

    if ((this.platform.is('mobile') && !this.platform.is('hybrid')) || this.platform.is('desktop')) {
      this.usePicker = true;
    }
  }

  public pickerImage(): void {
    if (!Capacitor.isPluginAvailable('Camera')) {
      this.filePicker.nativeElement.click();

      return;
    }

    Plugins.Camera.getPhoto({
      quality: 50,
      source: CameraSource.Prompt,
      correctOrientation: true,
      width: 300,
      resultType: CameraResultType.Base64
    }).then((image) => {
      console.log(image);
      this.selectedImage = image.base64String;
      this.imagePicker.emit(image.base64String);
    }).catch((error) => {
      console.log(error);
      if (this.usePicker) {
        this.filePicker.nativeElement.click();
      }

      return false;
    });
  }

  public fileChoosen(event: Event): void {
    const pickedFile = (event.target as HTMLInputElement).files[0];

    if (!pickedFile) {
      return;
    }

    const fileReader = new FileReader();

    fileReader.onload = () => {
      const dataUrl = fileReader.result.toString();

      this.selectedImage = dataUrl;
      this.imagePicker.emit(pickedFile);
    };

    fileReader.readAsDataURL(pickedFile);
  }
}

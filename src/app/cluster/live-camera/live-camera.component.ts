import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { Subscription } from 'rxjs';
import { sampleTime } from 'rxjs/operators';
import { WebSocketService } from '../../webSocket/web-socket.service';

@Component({
  selector: 'app-live-camera',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './live-camera.component.html',
  styleUrl: './live-camera.component.css'
})
export class LiveCameraComponent {
  public image: string | undefined;
  public rearImage: string | undefined;
  public loading: boolean = true;
  public rearLoading: boolean = true;

  private canvasSize: number[] = [512, 270];
  private rearCanvasSize: number[] = [640, 360];

  private cameraSubscription: Subscription | undefined;
  private rearCameraSubscription: Subscription | undefined;

  private loadingTimeout: any;
  private rearLoadingTimeout: any;

  constructor(
    private webSocketService: WebSocketService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.image = this.createBlackImage();
    this.rearImage = this.createBlackRearImage();

    // Front camera: sample in browser to keep dashboard stable
    this.cameraSubscription = this.webSocketService.receiveCamera()
      .pipe(sampleTime(100))
      .subscribe(
        (message) => {
          this.ngZone.run(() => {
            this.image = `data:image/jpeg;base64,${message.value}`;
            this.loading = false;

            if (this.loadingTimeout) {
              clearTimeout(this.loadingTimeout);
            }

            this.loadingTimeout = setTimeout(() => {
              this.loading = true;
              this.image = this.createBlackImage();
              this.cdr.detectChanges();
            }, 3000);

            this.cdr.detectChanges();
          });
        },
        (error) => {
          this.ngZone.run(() => {
            this.image = this.createBlackImage();
            this.loading = true;
            console.error('Error receiving front camera:', error);
            this.cdr.detectChanges();
          });
        }
      );

    // Rear camera: keep as-is, lighter stream
    this.rearCameraSubscription = this.webSocketService.receiveRearCamera().subscribe(
      (message) => {
        this.ngZone.run(() => {
          this.rearImage = `data:image/jpeg;base64,${message.value}`;
          this.rearLoading = false;

          if (this.rearLoadingTimeout) {
            clearTimeout(this.rearLoadingTimeout);
          }

          this.rearLoadingTimeout = setTimeout(() => {
            this.rearLoading = true;
            this.rearImage = this.createBlackRearImage();
            this.cdr.detectChanges();
          }, 5000);

          this.cdr.detectChanges();
        });
      },
      (error) => {
        this.ngZone.run(() => {
          this.rearImage = this.createBlackRearImage();
          this.rearLoading = true;
          console.error('Error receiving rear camera:', error);
          this.cdr.detectChanges();
        });
      }
    );
  }

  ngOnDestroy() {
    if (this.cameraSubscription) {
      this.cameraSubscription.unsubscribe();
    }

    if (this.rearCameraSubscription) {
      this.rearCameraSubscription.unsubscribe();
    }

    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }

    if (this.rearLoadingTimeout) {
      clearTimeout(this.rearLoadingTimeout);
    }
  }

  createBlackImage(): string {
    const canvas = document.createElement('canvas');
    canvas.width = this.canvasSize[0];
    canvas.height = this.canvasSize[1];
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    return canvas.toDataURL('image/png');
  }

  createBlackRearImage(): string {
    const canvas = document.createElement('canvas');
    canvas.width = this.rearCanvasSize[0];
    canvas.height = this.rearCanvasSize[1];
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    return canvas.toDataURL('image/png');
  }
}
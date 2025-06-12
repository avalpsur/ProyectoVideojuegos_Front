import { NgModule } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import {
  Trash,
  Pencil,
  MessageSquare,
  MessageCircle,
  ChevronDown,
  Gamepad2,
  Bell,
  TrendingUp,
  Users
} from 'lucide-angular';

const icons = {
  Trash,
  Pencil,
  MessageSquare,
  MessageCircle,
  ChevronDown,
  Gamepad2,
  Bell,
  TrendingUp,
  Users
};

@NgModule({
  imports: [LucideAngularModule.pick(icons)],
  exports: [LucideAngularModule]
})
export class LucideIconsModule {}

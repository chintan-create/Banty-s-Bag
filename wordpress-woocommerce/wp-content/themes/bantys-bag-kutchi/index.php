<?php
/**
 * Main Fallback Index Template
 */
get_header();
?>
<div class="bb-container" style="padding: 3rem 1.5rem;">
	<?php
	if ( have_posts() ) :
		while ( have_posts() ) :
			the_post();
			?>
			<article style="background:#ffffff; border:1px solid var(--bb-slate-200); border-radius:0.75rem; padding:2rem; margin-bottom:2rem;">
				<h1 class="font-display" style="font-size:2rem; color:var(--bb-slate-900); margin-bottom:1rem;"><?php the_title(); ?></h1>
				<div style="font-size:0.9375rem; color:var(--bb-slate-700); line-height:1.7;">
					<?php the_content(); ?>
				</div>
			</article>
			<?php
		endwhile;
	endif;
	?>
</div>
<?php
get_footer();
